// Mobile Menu Toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');
        const menuItems = document.querySelectorAll('.menu-item');

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
            
            // Close any open dropdowns
            document.getElementById('mobile-about-menu').classList.add('hidden');
            document.getElementById('mobile-about-arrow').classList.remove('rotate-180');
            
            // Restore body scroll
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }

        mobileMenuButton.addEventListener('click', openMobileMenu);
        closeMobileMenuButton.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Mobile About Dropdown Toggle
        const mobileAboutToggle = document.getElementById('mobile-about-toggle');
        const mobileAboutMenu = document.getElementById('mobile-about-menu');
        const mobileAboutArrow = document.getElementById('mobile-about-arrow');

        if (mobileAboutToggle) {
            mobileAboutToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileAboutMenu.classList.toggle('hidden');
                mobileAboutArrow.classList.toggle('rotate-180');
            });
        }

        // Navbar Scroll Effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.remove('bg-transparent', 'text-white', 'py-3', 'lg:py-4');
                    navbar.classList.add('bg-white', 'text-gray-800', 'shadow-md', 'py-2', 'lg:py-3');
                } else {
                    navbar.classList.remove('bg-white', 'text-gray-800', 'shadow-md', 'py-2', 'lg:py-3');
                    navbar.classList.add('bg-transparent', 'text-white', 'py-3', 'lg:py-4');
                }
            });
        }

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

        // Donation form functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Donation type selection
            const donationOptions = document.querySelectorAll('.donation-option');
            donationOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Remove selected class from all options
                    donationOptions.forEach(opt => {
                        opt.classList.remove('selected');
                        const radio = opt.querySelector('.w-6');
                        radio.classList.remove('bg-green-500', 'border-green-500');
                        radio.classList.add('border-gray-300');
                    });
                    
                    // Add selected class to clicked option
                    this.classList.add('selected');
                    const radio = this.querySelector('.w-6');
                    radio.classList.add('bg-green-500', 'border-green-500');
                    radio.classList.remove('border-gray-300');
                });
            });
            
            // Donation amount selection
            const donationAmounts = document.querySelectorAll('.donation-amount');
            donationAmounts.forEach(amount => {
                amount.addEventListener('click', function() {
                    // Remove selected style from all amounts
                    donationAmounts.forEach(amt => {
                        amt.classList.remove('border-green-500', 'bg-green-50');
                        amt.classList.add('border-gray-200', 'bg-white');
                    });
                    
                    // Add selected style to clicked amount
                    this.classList.add('border-green-500', 'bg-green-50');
                    this.classList.remove('border-gray-200', 'bg-white');
                    
                    // Set custom amount field to empty when preset amount is selected
                    document.getElementById('custom-amount').value = '';
                });
            });
            
            // Clear preset amount when custom amount is entered
            const customAmount = document.getElementById('custom-amount');
            customAmount.addEventListener('input', function() {
                if (this.value) {
                    donationAmounts.forEach(amt => {
                        amt.classList.remove('border-green-500', 'bg-green-50');
                        amt.classList.add('border-gray-200', 'bg-white');
                    });
                }
            });
        });