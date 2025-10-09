// Navbar scroll effect with search bar visibility
  window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled-nav', 'text-gray-900');
      navbar.classList.remove('bg-transparent', 'text-white');
    } else {
      navbar.classList.remove('scrolled-nav', 'text-gray-900');
      navbar.classList.add('bg-transparent', 'text-white');
    }
  });
  
  // Simple carousel functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0';
    });
  }
  
  document.getElementById('nextSlide').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  });
  
  document.getElementById('prevSlide').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  });
  
  // Initialize the carousel
  showSlide(currentSlide);