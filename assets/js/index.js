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


  
    // Initialize Swiper for the news section
    const newsSwiper = new Swiper('.newsSwiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });

    // Initialize Main Swiper Carousel with enhanced Tailwind approach
const mainSwiper = new Swiper('.mySwiper', {
  // Effect
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  
  // Autoplay
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  
  // Loop
  loop: true,
  
  // Speed
  speed: 800,
  
  // Navigation
  navigation: {
    nextEl: '.swiper-button-next-custom',
    prevEl: '.swiper-button-prev-custom',
  },
  
  // Pagination
  pagination: {
    el: '.swiper-pagination-custom',
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="${className} w-3 h-3 rounded-full bg-white/50 cursor-pointer transition-all duration-300 hover:bg-white/80 swiper-pagination-bullet-custom"></span>`;
    },
  },
  
  // Callbacks
  on: {
    init: function() {
      updateProgressBar();
      activateCurrentSlide();
    },
    slideChange: function() {
      updateProgressBar();
      activateCurrentSlide();
    },
    slideChangeTransitionStart: function() {
      resetSlideAnimations();
    },
    slideChangeTransitionEnd: function() {
      activateCurrentSlide();
    }
  },
});

// Custom progress bar functionality
function updateProgressBar() {
  const progressBar = document.querySelector('.swiper-progress-bar');
  progressBar.classList.remove('transition-all', 'duration-5000', 'ease-linear');
  progressBar.style.width = '0%';
  
  // Force reflow
  void progressBar.offsetWidth;
  
  progressBar.classList.add('transition-all', 'duration-5000', 'ease-linear');
  progressBar.style.width = '100%';
}

// Activate current slide animations
function activateCurrentSlide() {
  const activeSlide = document.querySelector('.swiper-slide-active');
  const activeImage = activeSlide.querySelector('.swiper-image');
  const activeCaption = activeSlide.querySelector('.slide-caption');
  
  // Reset all slides first
  resetSlideAnimations();
  
  // Activate current slide
  setTimeout(() => {
    activeImage.classList.add('scale-105');
    activeCaption.classList.remove('translate-y-full');
  }, 100);
}

// Reset all slide animations
function resetSlideAnimations() {
  const allImages = document.querySelectorAll('.swiper-image');
  const allCaptions = document.querySelectorAll('.slide-caption');
  
  allImages.forEach(img => {
    img.classList.remove('scale-105');
  });
  
  allCaptions.forEach(caption => {
    caption.classList.add('translate-y-full');
  });
}

// Enhanced interaction handling
const mainSwiperContainer = document.querySelector('.mySwiper');

// Pause on hover
mainSwiperContainer.addEventListener('mouseenter', function() {
  mainSwiper.autoplay.stop();
  document.querySelector('.swiper-progress-bar').style.animationPlayState = 'paused';
});

mainSwiperContainer.addEventListener('mouseleave', function() {
  mainSwiper.autoplay.start();
  document.querySelector('.swiper-progress-bar').style.animationPlayState = 'running';
  updateProgressBar();
});

// Enhanced navigation click handlers
document.querySelector('.swiper-button-next-custom').addEventListener('click', function() {
  updateProgressBar();
  resetSlideAnimations();
});

document.querySelector('.swiper-button-prev-custom').addEventListener('click', function() {
  updateProgressBar();
  resetSlideAnimations();
});

// Enhanced pagination click handlers
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('swiper-pagination-bullet-custom')) {
    updateProgressBar();
    resetSlideAnimations();
  }
});

// Initialize first slide
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    activateCurrentSlide();
  }, 500);
});
