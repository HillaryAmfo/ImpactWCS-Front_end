
        // --- Slideshow Configuration Data ---
        const slideContent = [
            {
                img: "./assets/img/pexels-jay-brand-1763356224-32181432.jpg",
                typingText: "Protect vital tropical forests and their endangered inhabitants."
            },
            {
                img: "./assets/img/pexels-monkeytactics-750540 (1).jpg",
                typingText: "Be a guardian of the blue frontier and fragile coral reefs."
            },
            {
                img: "./assets/img/pexels-taryn-elliott-6551958.jpg",
                typingText: "Protect wildlife and wild places worldwide through science, conservation action, and sustainable partnerships."
            },
            {
                img: "./assets/img/pexels-wb2008-2541239.jpg",
                typingText: "Join us in creating a future where wildlife thrives in a just and sustainable world."
            }
        ];
        
        let lastScrollY = 0;
        const navbar = document.getElementById('navbar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');
        
        const slideshowContainer = document.getElementById('slideshow');
        
        let currentSlideIndex = 0;
        let typingInterval;


        // --- SLIDESHOW and TEXT SYNC LOGIC ---

        function updateSlideContent(index) {
            const content = slideContent[index];
            
            // 1. Reset Text Animation State
            const oldTextContainer = document.getElementById('hero-text-container');
            const newTextContainer = oldTextContainer.cloneNode(true);
            
            newTextContainer.classList.remove('animate-in');
            newTextContainer.querySelector('#typing-text').textContent = '';
            
            oldTextContainer.parentNode.replaceChild(newTextContainer, oldTextContainer);
            
            // Re-select the new element
            const newTypingTextElement = document.getElementById('hero-text-container').querySelector('#typing-text');
            
            // 2. Trigger Text Entrance Animation
            setTimeout(() => {
                document.getElementById('hero-text-container').classList.add('animate-in');
            }, 50);

            // 3. Start Typing Effect (Delayed until AFTER the 1s slideTextIn animation)
            setTimeout(() => {
                startTypingEffect(content.typingText, newTypingTextElement);
            }, 1050); // 1000ms (animation) + 50ms buffer
        }

        function startTypingEffect(text, element) {
            if (typingInterval) clearInterval(typingInterval);
            element.textContent = '';
            element.style.borderRight = '2px solid rgba(255, 255, 255, 0.75)'; // Show cursor
            
            let charIndex = 0;
            
            typingInterval = setInterval(() => {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    element.style.borderRight = 'none'; // Remove cursor
                }
            }, 40); // Typing speed
        }
        
        function nextSlide() {
            const slides = document.querySelectorAll('#slideshow .slideshow-img');
            if (slides.length === 0) return;

            // 1. Remove zoom and active state from old slide
            slides[currentSlideIndex].classList.remove('active-slide');

            // 2. Calculate next slide index
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;

            // 3. Add active state (triggers fade-in and zoom animation)
            slides[currentSlideIndex].classList.add('active-slide');
            
            // 4. Update dynamic text content
            updateSlideContent(currentSlideIndex);
        }
        
        function initializeSlideshow() {
            // Dynamically create <img> elements from slideContent array
            slideContent.forEach((content, index) => {
                const img = document.createElement('img');
                img.classList.add('slideshow-img');
                img.src = content.img;
                img.alt = content.h1;
                slideshowContainer.appendChild(img);
            });
            
            // Start the first slide's content and animation
            if (slideContent.length > 0) {
                document.querySelectorAll('#slideshow .slideshow-img')[0].classList.add('active-slide');
                updateSlideContent(0);
                
                // Start the automatic cycle: 10000 milliseconds = 10 seconds
                setInterval(nextSlide, 10000); 
            }
        }
        
        // --- Navbar Scroll Behavior ---
        function handleNavbarScroll() {
            const currentScrollY = window.scrollY;

            // If scrolling down AND current scroll position is beyond the initial navbar height
            if (currentScrollY > lastScrollY && currentScrollY > navbar.offsetHeight) {
                // Scrolling down
                navbar.classList.add('navbar-hidden');
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                navbar.classList.remove('navbar-hidden');
                
                if (currentScrollY <= 50) { 
                    navbar.classList.remove('bg-white', 'shadow-lg', 'text-gray-800');
                    navbar.classList.add('bg-transparent', 'text-white');
                } else {
                    // Stay white/shadowed if still far from top but scrolling up
                    navbar.classList.add('bg-white', 'shadow-lg', 'text-gray-800');
                    navbar.classList.remove('bg-transparent', 'text-white');
                }
            } else if (currentScrollY <= 50) {
                 // At the very top, ensure it's transparent
                navbar.classList.remove('bg-white', 'shadow-lg', 'text-gray-800');
                navbar.classList.add('bg-transparent', 'text-white');
            } else {
                // If not at top and not scrolling down, keep it white/shadowed
                navbar.classList.add('bg-white', 'shadow-lg', 'text-gray-800');
                navbar.classList.remove('bg-transparent', 'text-white');
            }

            lastScrollY = currentScrollY;
        }

        window.addEventListener('scroll', handleNavbarScroll);
        
        // Mobile menu toggle functionality
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuSidebar.classList.remove('translate-x-full');
            mobileMenuOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; 
        });

        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenuSidebar.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenuSidebar.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = ''; 
        });

        // Initialize Everything
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            handleNavbarScroll(); // Initial call to set correct navbar state
            initializeSlideshow();
        });

    