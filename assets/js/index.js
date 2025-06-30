
  window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');

    if (window.scrollY > 0) {
      navbar.classList.remove('bg-transparent', 'text-white');
      navbar.classList.add('bg-white', 'text-black', 'shadow-md', 'bg-opacity-100');

      // Adjust search input and icon
      searchInput.classList.remove('border-white', 'placeholder-white', 'text-white');
      searchInput.classList.add('border-black', 'placeholder-black', 'text-black');
      searchIcon.classList.remove('text-white');
      searchIcon.classList.add('text-black');
    } else {
      navbar.classList.remove('bg-white', 'text-black', 'shadow-md');
      navbar.classList.add('bg-transparent', 'text-white');

      // Revert search input and icon
      searchInput.classList.remove('border-black', 'placeholder-black', 'text-black');
      searchInput.classList.add('border-white', 'placeholder-white', 'text-white');
      searchIcon.classList.remove('text-black');
      searchIcon.classList.add('text-white');
    }
  });


// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  // Function to go to a specific slide
  function goToSlide(index) {
    slides.forEach((slide) => {
      slide.style.opacity = '0';
    });
    slides[index].style.opacity = '1';
    currentSlide = index;
  }
  
  // Function to go to next slide
  function nextSlide() {
    const next = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    goToSlide(next);
  }
  
  // Function to go to previous slide
  function prevSlide() {
    const prev = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    goToSlide(prev);
  }
  
  // Add click event listeners
  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);
  
  // Auto slide every 5 seconds
  const interval = setInterval(nextSlide, 5000);
  
  // Clear interval when user interacts with the carousel
  prevButton.addEventListener('click', () => {
    clearInterval(interval);
  });
  
  nextButton.addEventListener('click', () => {
    clearInterval(interval);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  new Swiper('.mySwiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      reachEnd: function () {
        document.querySelector('.swiper-button-next').style.display = 'none';
      },
      fromEdge: function () {
        document.querySelector('.swiper-button-next').style.display = 'flex';
      }
    }
  });
});