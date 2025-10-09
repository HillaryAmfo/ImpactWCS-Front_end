// components-loader.js

// Load header
fetch('/assets/html/header.html')
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
        initMobileMenu();
    })
    .catch(err => console.error('Failed to load header:', err));

// Load footer  
fetch('/assets/html/footer.html')
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    })
    .catch(err => console.error('Failed to load footer:', err));

// Mobile menu function
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navbarLinks = document.getElementById('navbar-links');
    
    if (mobileMenuButton && navbarLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navbarLinks.classList.toggle('hidden');
        });
    }
}