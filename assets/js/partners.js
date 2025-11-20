 // Mobile Menu Elements
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');
        const menuItems = document.querySelectorAll('.menu-item');

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
            window.addEventListener('scroll', handleNavbarScroll);
        });