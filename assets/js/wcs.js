// --- Slideshow Configuration Data ---
        const slideContent = [
            {
                img: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                typingText: "Protect vital tropical forests and their endangered inhabitants."
            },
            {
                img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                typingText: "Be a guardian of the blue frontier and fragile coral reefs."
            },
            {
                img: "https://images.unsplash.com/photo-1559825481-12a05cc00344?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1065&q=80",
                typingText: "Protect wildlife and wild places worldwide through science, conservation action, and sustainable partnerships."
            },
            {
                img: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
                typingText: "Join us in creating a future where wildlife thrives in a just and sustainable world."
            }
        ];
        
        // Mobile Menu Elements
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');
        const menuItems = document.querySelectorAll('.menu-item');
        
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

        // Mobile menu functionality
        function openMobileMenu() {
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuSidebar.classList.remove('translate-x-full');
            mobileMenuOverlay.classList.add('fade-in');
            mobileMenuSidebar.classList.add('slide-in-right');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Animate menu items with staggered delay
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100 + (index * 50));
            });
        }

        function closeMobileMenu() {
            mobileMenuOverlay.classList.add('hidden');
            mobileMenuSidebar.classList.add('translate-x-full');
            
            // Reset menu items animation
            menuItems.forEach(item => {
                item.classList.remove('visible');
            });
            
            // Restore body scroll
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }

        // Navbar Scroll Effect
        const navbar = document.getElementById('navbar');
        function handleNavbarScroll() {
            if (window.scrollY > 50) {
                navbar.classList.remove('bg-transparent', 'text-white', 'py-3', 'lg:py-4');
                navbar.classList.add('bg-white', 'text-gray-800', 'shadow-md', 'py-2', 'lg:py-3');
            } else {
                navbar.classList.remove('bg-white', 'text-gray-800', 'shadow-md', 'py-2', 'lg:py-3');
                navbar.classList.add('bg-transparent', 'text-white', 'py-3', 'lg:py-4');
            }
        }

        // Event Listeners
        mobileMenuButton.addEventListener('click', openMobileMenu);
        closeMobileMenuButton.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#mobile-menu-sidebar a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                closeMobileMenu();
            }
        });

        // Initialize Everything
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            handleNavbarScroll(); // Initial call to set correct navbar state
            initializeSlideshow();
            window.addEventListener('scroll', handleNavbarScroll);
        });