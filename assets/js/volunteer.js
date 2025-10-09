// ===== Navbar, Mobile Menu, Smooth Scroll, Contact Form, Lucide, and About button color sync =====
document.addEventListener('DOMContentLoaded', () => {
  // --- Element refs ---
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
  const closeMobileMenuButton = document.getElementById('close-mobile-menu');
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  const aboutToggle = document.getElementById('about-toggle'); // <-- important for scroll color fix

  // --- Helpers ---
  const isScrolled = () => window.scrollY > 50;

  // Keep the About button legible against transparent (dark) vs white (light) navbar
  function updateAboutStyles(scrolled) {
    if (!aboutToggle) return;
    if (scrolled) {
      // On white nav, use dark text/border
      aboutToggle.classList.add('text-gray-800', 'border-gray-800');
      aboutToggle.classList.remove('text-white', 'border-white');
    } else {
      // On transparent nav, use white text/border
      aboutToggle.classList.add('text-white', 'border-white');
      aboutToggle.classList.remove('text-gray-800', 'border-gray-800');
    }
  }

  // Navbar scroll behavior (transparent -> white)
  function handleNavbarScroll() {
    if (!navbar) return;
    const scrolled = isScrolled();

    if (scrolled) {
      navbar.classList.add('bg-white', 'shadow-lg', 'py-3', 'text-gray-800');
      navbar.classList.remove('py-4', 'bg-transparent', 'text-white');
    } else {
      navbar.classList.remove('bg-white', 'shadow-lg', 'py-3', 'text-gray-800');
      navbar.classList.add('py-4', 'bg-transparent', 'text-white');
    }

    updateAboutStyles(scrolled);
  }

  // Init navbar state on load
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // --- Mobile menu open/close ---
  function openMobileMenu() {
    if (!mobileMenuSidebar || !mobileMenuOverlay) return;
    mobileMenuSidebar.classList.remove('translate-x-full');
    mobileMenuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // lock scroll
    // focus first focusable element for a11y
    const firstFocusable = mobileMenuSidebar.querySelector('a,button,summary,[tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenuSidebar || !mobileMenuOverlay) return;
    mobileMenuSidebar.classList.add('translate-x-full');
    mobileMenuOverlay.classList.add('hidden');
    document.body.style.overflow = ''; // restore scroll
    if (mobileMenuButton) mobileMenuButton.focus();
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', openMobileMenu);
  }
  if (closeMobileMenuButton) {
    closeMobileMenuButton.addEventListener('click', closeMobileMenu);
  }
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuSidebar && !mobileMenuSidebar.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  // --- Smooth scroll for internal links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      // Ignore bare "#" links
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // If mobile menu is open, close it before scrolling
      if (mobileMenuSidebar && !mobileMenuSidebar.classList.contains('translate-x-full')) {
        closeMobileMenu();
      }

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      });
    });
  });

  // --- Contact form submit (simulated) ---
  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // stay on page

      // Collect form data (optional debug)
      const formData = new FormData(contactForm);
      const data = {};
      for (const [key, value] of formData.entries()) data[key] = value;
      console.log('Form submitted!', data);

      // Simulate API delay
      setTimeout(() => {
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
          contactForm.reset();
        }, 5000);
      }, 500);
    });
  }

  // --- Lucide icons ---
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});




 document.addEventListener('DOMContentLoaded', function() {
            const wrapper = document.getElementById('storiesWrapper');
            const storyPairs = document.querySelectorAll('.volunteer-story-pair');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const indicatorsContainer = document.getElementById('indicators');
            
            let currentIndex = 0;
            let autoSlideInterval;
            const slideInterval = 10000; // 10 seconds
            
            // Create indicators
            storyPairs.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });
            
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            // Function to go to a specific slide
            function goToSlide(index) {
                currentIndex = index;
                updateCarousel();
                resetAutoSlide();
            }
            
            // Function to update carousel display
            function updateCarousel() {
                const translateX = -currentIndex * 100;
                wrapper.style.transform = `translateX(${translateX}%)`;
                
                // Update indicators
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
            
            // Function to go to next slide
            function nextSlide() {
                currentIndex = (currentIndex + 1) % storyPairs.length;
                updateCarousel();
            }
            
            // Function to go to previous slide
            function prevSlide() {
                currentIndex = (currentIndex - 1 + storyPairs.length) % storyPairs.length;
                updateCarousel();
            }
            
            // Function to start auto slide
            function startAutoSlide() {
                autoSlideInterval = setInterval(nextSlide, slideInterval);
            }
            
            // Function to reset auto slide timer
            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            }
            
            // Event listeners for navigation
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
            
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
            
            // Pause auto slide on hover
            const carouselContainer = document.querySelector('.volunteer-stories-section');
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
            
            // Initialize carousel
            updateCarousel();
            startAutoSlide();
            
            // Touch swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            wrapper.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            wrapper.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - next slide
                    nextSlide();
                    resetAutoSlide();
                }
                
                if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - previous slide
                    prevSlide();
                    resetAutoSlide();
                }
            }
        });