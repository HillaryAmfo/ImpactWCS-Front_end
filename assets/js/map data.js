
/* ================== Regions / country codes ================== */
const REGION_CODES = {
  AFRICA:  new Set(["DZ","AO","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CD","CG","CI","DJ","EG","GQ","ER","SZ","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML","MR","MU","MA","MZ","NA","NE","NG","RE","RW","ST","SN","SC","SL","SO","ZA","SS","SD","TZ","TG","TN","UG","EH","ZM","ZW"]),
  ASIA:    new Set(["AF","AM","AZ","BH","BD","BT","BN","KH","CN","CY","GE","IN","ID","IR","IQ","IL","JP","JO","KZ","KW","KG","LA","LB","MY","MV","MN","MM","NP","KP","OM","PK","PS","PH","QA","SA","SG","KR","LK","SY","TW","TJ","TH","TL","TR","TM","AE","UZ","VN","YE","RU"]),
  EUROPE:  new Set(["AL","AD","AT","BY","BE","BA","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GI","GR","HU","IS","IE","IT","XK","LV","LI","LT","LU","MT","MD","MC","ME","NL","MK","NO","PL","PT","RO","RU","SM","RS","SK","SI","ES","SE","CH","UA","GB","VA","TR"]),
  N_AMERICA: new Set(["AG","BS","BB","BZ","CA","CR","CU","DM","DO","SV","GD","GT","HT","HN","JM","MX","NI","PA","KN","LC","VC","TT","US","GL","BM","PM"]),
  S_AMERICA: new Set(["AR","BO","BR","CL","CO","EC","FK","GF","GY","PY","PE","SR","UY","VE"]),
  OCEANIA: new Set(["AS","AU","CK","FJ","PF","GU","KI","MH","FM","NR","NC","NZ","MP","PW","PG","PN","WS","SB","TK","TO","TV","VU","WF"])
};
const PRETTY = {AFRICA:"Africa",ASIA:"Asia",EUROPE:"Europe",N_AMERICA:"North America",S_AMERICA:"South America",OCEANIA:"Oceania"};

/* ================== Fetch World Bank data (live) ================== */
/* ER.LND.PTLD.ZS (protected % of land), AG.LND.TOTL.K2 (land km²) */
const WB_BASE = "https://api.worldbank.org/v2";
const INDICATORS = {
  PROT_PCT: "ER.LND.PTLD.ZS",
  LAND_KM2: "AG.LND.TOTL.K2"
};
async function fetchWB(indicator){
  // pull all years for all countries; per_page high to get all rows
  const url = `${WB_BASE}/country/all/indicator/${indicator}?format=json&per_page=20000`;
  const res = await fetch(url);
  const js = await res.json();
  return js[1] || [];
}
function latestByCountry(rows){
  // rows: [{country:{id:'GH'}, date:'2022', value: 21.3, ...}, ...]
  const out = {};
  rows.forEach(r=>{
    const id = r.country && r.country.id;
    const yr = +r.date;
    if(!id || r.value == null || isNaN(yr)) return;
    if(!out[id] || yr > out[id].year){
      out[id] = { value: +r.value, year: yr };
    }
  });
  return out;
}
function seriesByCountry(rows){
  // returns { GH: [{year:2010,value:..}, ...], ... }
  const out = {};
  rows.forEach(r=>{
    const id = r.country && r.country.id;
    const yr = +r.date;
    if(!id || r.value==null || isNaN(yr)) return;
    (out[id] ||= []).push({ year: yr, value: +r.value });
  });
  // sort each series ascending year
  Object.values(out).forEach(arr=>arr.sort((a,b)=>a.year-b.year));
  return out;
}

/* ================== State ================== */
let currentRegion = "AFRICA";
let latestPct = {};        // { ISO2: {value, year} }
let pctSeries = {};        // { ISO2: [{year,value}...] }
let landKm2Latest = {};    // { ISO2: {value, year} }

/* ================== UI helpers ================== */
const $loading = document.getElementById("loading");
function fmtKm2(v){ if(v==null || isNaN(v)) return "—"; const m = v/1e6; return m>=0.1? m.toFixed(2)+"M" : (v/1e3).toFixed(0)+"k"; }
function avg(nums){ const a = nums.filter(x=>x!=null && !isNaN(x)); return a.length? a.reduce((p,c)=>p+c,0)/a.length : null; }
function sum(nums){ const a = nums.filter(x=>x!=null && !isNaN(x)); return a.length? a.reduce((p,c)=>p+c,0) : null; }

/* ================== Build charts ================== */
// MAP
let mapRoot = am5.Root.new("mapdiv");
mapRoot.setThemes([ am5themes_Animated.new(mapRoot) ]);
let mapChart = mapRoot.container.children.push(am5map.MapChart.new(mapRoot, {
  panX:"translateX", panY:"translateY", projection: am5map.geoMercator()
}));
mapChart.set("zoomControl", am5map.ZoomControl.new(mapRoot, {}));
let countrySeries = mapChart.series.push(am5map.MapPolygonSeries.new(mapRoot, {
  geoJSON: am5geodata_worldLow, exclude:["AQ"], valueField:"value"
}));
countrySeries.mapPolygons.template.setAll({
  tooltipText: "{name}: {value.formatNumber('#.0')}%",
  interactive: true,
  fill: am5.color(0x2a3a7a),
  stroke: am5.color(0x3d4c95), strokeOpacity:.7
});
countrySeries.set("heatRules", [{
  target: countrySeries.mapPolygons.template,
  dataField: "value",
  min: am5.color(0x93c5fd), // light
  max: am5.color(0x1d4ed8), // deep
  key: "fill"
}]);
countrySeries.mapPolygons.template.states.create("dimmed", { fillOpacity:.15, strokeOpacity:.1 });
countrySeries.mapPolygons.template.states.create("hover", { fill: am5.color(0x3f58c9) });

let heatLegend = mapChart.children.push(am5.HeatLegend.new(mapRoot, {
  orientation: "horizontal",
  startColor: am5.color(0x93c5fd), endColor: am5.color(0x1d4ed8),
  startText: "Lower", endText: "Higher",
  y: am5.percent(100), centerX: am5.p50, x: am5.p50, paddingTop:8
}));

// Continents (for zoom)
let continents = mapChart.series.push(am5map.MapPolygonSeries.new(mapRoot, {
  geoJSON: am5geodata_continentsLow, exclude:["antarctica"], visible:false
}));
function zoomToContinentByName(name){
  const di = continents.dataItems.find(d => (d.get("name")||"").toLowerCase() === name.toLowerCase());
  if(!di) return;
  const p = di.get("polygon"); if(p && p._geoBounds) mapChart.zoomToGeoBounds(p._geoBounds, 800);
}

// BAR
let barRoot = am5.Root.new("barchartdiv");
barRoot.setThemes([ am5themes_Animated.new(barRoot) ]);
let barChart = barRoot.container.children.push(am5xy.XYChart.new(barRoot, { panX:false, panY:false, wheelX:"none", wheelY:"none", paddingLeft:10, paddingRight:10 }));
let catAxis = barChart.xAxes.push(am5xy.CategoryAxis.new(barRoot, {
  categoryField:"metric",
  renderer: am5xy.AxisRendererX.new(barRoot, { minGridDistance:20, grid:{visible:false}, labels:{ centerY: am5.p50, rotation:-15 } })
}));
let valAxis = barChart.yAxes.push(am5xy.ValueAxis.new(barRoot, { renderer: am5xy.AxisRendererY.new(barRoot, {}) }));
let colSeries = barChart.series.push(am5xy.ColumnSeries.new(barRoot, {
  xAxis:catAxis, yAxis:valAxis, categoryXField:"metric", valueYField:"value",
  tooltip: am5.Tooltip.new(barRoot, { labelText: "{categoryX}: {valueY}" })
}));
colSeries.columns.template.setAll({ cornerRadiusTL:6, cornerRadiusTR:6 });

// LINE
let lineRoot = am5.Root.new("linechartdiv");
lineRoot.setThemes([ am5themes_Animated.new(lineRoot) ]);
let lineChart = lineRoot.container.children.push(am5xy.XYChart.new(lineRoot, { panX:true, panY:false, wheelX:"panX", wheelY:"zoomX", paddingLeft:10, paddingRight:10 }));
let dateAxis = lineChart.xAxes.push(am5xy.DateAxis.new(lineRoot, { baseInterval:{timeUnit:"year",count:1}, renderer: am5xy.AxisRendererX.new(lineRoot, {}) }));
let valueAxis = lineChart.yAxes.push(am5xy.ValueAxis.new(lineRoot, { renderer: am5xy.AxisRendererY.new(lineRoot, {}) }));
let lineSeries = lineChart.series.push(am5xy.LineSeries.new(lineRoot, {
  name:"Avg protected land (% of land)",
  xAxis:dateAxis, yAxis:valueAxis,
  valueYField:"value", valueXField:"date",
  tooltip: am5.Tooltip.new(lineRoot, { labelText:"{valueY.formatNumber('#.0')}%" }),
  connect:true
}));

// DRILL sparkline
const panel = document.getElementById("countryPanel");
const titleEl = document.getElementById("countryTitle");
const regionEl = document.getElementById("countryRegion");
const fact1v = document.getElementById("fact1v");
const fact2v = document.getElementById("fact2v");
document.getElementById("closePanel").onclick = ()=> panel.style.display="none";

let sparkRoot = am5.Root.new("sparkdiv");
sparkRoot.setThemes([ am5themes_Animated.new(sparkRoot) ]);
let sparkChart = sparkRoot.container.children.push(am5xy.XYChart.new(sparkRoot, {
  panX:false, panY:false, wheelX:"none", wheelY:"none",
  paddingLeft:6, paddingRight:6, paddingTop:6, paddingBottom:6
}));
let sDateAxis = sparkChart.xAxes.push(am5xy.DateAxis.new(sparkRoot, { baseInterval:{timeUnit:"year",count:1}, renderer: am5xy.AxisRendererX.new(sparkRoot,{inside:true,visible:false}) }));
let sValAxis  = sparkChart.yAxes.push(am5xy.ValueAxis.new(sparkRoot, { renderer: am5xy.AxisRendererY.new(sparkRoot,{inside:true,visible:false}) }));
let sSeries   = sparkChart.series.push(am5xy.LineSeries.new(sparkRoot, {
  xAxis:sDateAxis, yAxis:sValAxis, valueXField:"date", valueYField:"value",
  tooltip: am5.Tooltip.new(sparkRoot, { labelText:"{valueY.formatNumber('#.0')}%" }), connect:true
}));
countrySeries.mapPolygons.template.events.on("click", ev=>{
  const di = ev.target.dataItem;
  const iso2 = di.get("id");
  const name = di.get("name");
  const regionKey = Object.keys(REGION_CODES).find(r => REGION_CODES[r].has(iso2)) || "—";
  const pct = latestPct[iso2]?.value ?? null;
  const land = landKm2Latest[iso2]?.value ?? null;
  const protKm2 = (pct!=null && land!=null) ? land * (pct/100) : null;

  // country series
  const ser = (pctSeries[iso2] || []).map(d=>({ date: new Date(d.year,0,1).getTime(), value: d.value }));
  sSeries.data.setAll(ser);

  titleEl.textContent = name || iso2;
  regionEl.textContent = PRETTY[regionKey] || regionKey;
  fact1v.textContent = pct!=null ? pct.toFixed(1) + "%" : "—";
  fact2v.textContent = protKm2!=null ? fmtKm2(protKm2) : "—";
  panel.style.display = "block";
});

/* ================== Region wiring & updates ================== */
const buttons = document.querySelectorAll(".toolbar button");
buttons.forEach(btn => btn.addEventListener("click", ()=> setRegion(btn.dataset.region)));

function setRegion(regionKey){
  currentRegion = regionKey;
  buttons.forEach(b => b.classList.toggle("active", b.dataset.region === regionKey));

  // heat data and dimming
  const heatData = [];
  countrySeries.mapPolygons.each(p => {
    const id = p.dataItem.get("id");
    const inRegion = REGION_CODES[regionKey].has(id);
    const v = latestPct[id]?.value ?? null;
    p.states.applyAnimate(inRegion ? "default" : "dimmed");
    p.set("interactive", !!(inRegion && v!=null));
    if(v!=null) heatData.push({ id, value: v });
  });
  countrySeries.data.setAll(heatData);

  // legend scale
  const vals = heatData.map(d=>d.value);
  if(vals.length){
    heatLegend.setAll({ startValue: Math.min(...vals), endValue: Math.max(...vals) });
  }

  // zoom
  zoomToContinentByName(PRETTY[regionKey]);

  // BAR: build 3 metrics
  // 1) Protected land (km², sum)  2) Avg % protected  3) #countries >=30% (Kunming-Montreal Target 3)
  const iso2s = [...REGION_CODES[regionKey]];
  const pctVals = iso2s.map(c => latestPct[c]?.value).filter(v=>v!=null);
  const landVals = iso2s.map(c => {
    const land = landKm2Latest[c]?.value;
    const pct  = latestPct[c]?.value;
    return (land!=null && pct!=null) ? land * (pct/100) : null;
  }).filter(v=>v!=null);

  const protKm2Sum = sum(landVals) || 0;
  const avgPct = avg(pctVals) || 0;
  const count30 = iso2s.reduce((n,c)=> n + ((latestPct[c]?.value||0) >= 30 ? 1 : 0), 0);

  const barData = [
    { metric: "Protected land (km², est.)", value: +protKm2Sum.toFixed(0) },
    { metric: "Avg % protected", value: +avgPct.toFixed(1) },
    { metric: "Countries ≥30% target", value: count30 }
  ];
  catAxis.data.setAll(barData);
  colSeries.data.setAll(barData);

  // LINE: average % per year (2000→latest)
  const years = new Set();
  iso2s.forEach(c => (pctSeries[c]||[]).forEach(d=>years.add(d.year)));
  const yearsSorted = [...years].sort((a,b)=>a-b).filter(y=>y>=2000);
  const lineData = yearsSorted.map(y=>{
    const arr = iso2s.map(c => {
      const d = (pctSeries[c]||[]).find(t=>t.year===y);
      return d ? d.value : null;
    }).filter(v=>v!=null);
    return { date: new Date(y,0,1).getTime(), value: arr.length ? arr.reduce((p,c)=>p+c,0)/arr.length : null };
  }).filter(d=>d.value!=null);
  lineSeries.data.setAll(lineData);
}

/* ================== Boot: load data then init ================== */
(async function init(){
  try{
    const [protPctRows, landRows] = await Promise.all([
      fetchWB(INDICATORS.PROT_PCT), // ER.LND.PTLD.ZS
      fetchWB(INDICATORS.LAND_KM2)  // AG.LND.TOTL.K2
    ]);

    latestPct = latestByCountry(protPctRows);
    pctSeries = seriesByCountry(protPctRows);
    landKm2Latest = latestByCountry(landRows);

    $loading.textContent = "Data loaded";
    setTimeout(()=> $loading.style.display = "none", 800);

    // set defaults
    setRegion("AFRICA");
    mapChart.appear(800,200);
    barChart.appear(800,200);
    lineChart.appear(800,200);
  }catch(err){
    console.error(err);
    $loading.textContent = "Data load failed. Check your internet connection.";
  }
})();