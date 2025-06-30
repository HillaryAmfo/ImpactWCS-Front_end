let lastScrollY = 0;
        const navbar = document.getElementById('navbar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');

        // Function to handle navbar scroll behavior (hide on scroll down, show on scroll up)
        function handleNavbarScroll() {
            const currentScrollY = window.scrollY;

            // If scrolling down AND current scroll position is beyond the initial navbar height
            // (prevents hiding immediately at the very top of the page)
            if (currentScrollY > lastScrollY && currentScrollY > navbar.offsetHeight) {
                // Scrolling down
                navbar.classList.add('navbar-hidden');
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                navbar.classList.remove('navbar-hidden');
                // Also, if scrolled up significantly, revert to transparent background (if not already)
                if (currentScrollY <= 50) { // Threshold for full transparency
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
        // Initial call to set correct navbar state on page load
        document.addEventListener('DOMContentLoaded', handleNavbarScroll);


        // Mobile menu toggle functionality
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuSidebar.classList.remove('translate-x-full');
            mobileMenuOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
        });

        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenuSidebar.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenuSidebar.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Smooth scroll for internal links (e.g., "Contact" in navbar)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default jump behavior
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Close mobile menu if open before scrolling
                    mobileMenuSidebar.classList.add('translate-x-full');
                    mobileMenuOverlay.classList.add('hidden');
                    document.body.style.overflow = '';

                    // Scroll to the target element smoothly, offsetting for the fixed navbar
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Initialize Lucide icons after the DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
        });