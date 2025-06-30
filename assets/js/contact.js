// Get references to DOM elements
        const navbar = document.getElementById('navbar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');
        const contactForm = document.getElementById('contact-form');
        const successMessage = document.getElementById('success-message');

        // Function to handle navbar scroll behavior
        function handleNavbarScroll() {
            // Check if the scroll position is greater than 50 pixels from the top
            if (window.scrollY > 50) {
                // Add Tailwind classes to make the navbar sticky, give it a background, and shadow
                navbar.classList.add('bg-white', 'shadow-lg', 'py-3', 'text-gray-800');
                navbar.classList.remove('py-4', 'bg-transparent', 'text-white');
            } else {
                // Remove Tailwind classes when scrolled back to the top
                navbar.classList.remove('bg-white', 'shadow-lg', 'py-3', 'text-gray-800');
                navbar.classList.add('py-4', 'bg-transparent', 'text-white');
            }
        }

        // Add scroll event listener to the window to trigger navbar changes
        window.addEventListener('scroll', handleNavbarScroll);

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

        // Handle form submission
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            console.log('Form submitted!');
            const formData = new FormData(contactForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            console.log('Form Data:', data);

            // Simulate API call delay
            setTimeout(() => {
                // Display success message
                successMessage.classList.remove('hidden');

                // Optionally, hide the success message and clear form after a few seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    contactForm.reset();
                }, 5000); // Hide after 5 seconds
            }, 500); // Simulate network delay

        });

        // Initialize Lucide icons after the DOM is loaded
        document.addEventListener('DOMContentLoaded', (event) => {
            lucide.createIcons();
        });
