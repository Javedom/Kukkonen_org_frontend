export function initNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const allNavLinks = document.querySelectorAll('.nav-link, #mobile-menu a');

    // Toggle Mobile Menu
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Smooth Scroll & Active Link
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target') || link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                updateActiveLinks(targetId);
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // Scroll Spy
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 150;
        document.querySelectorAll('section.page').forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                updateActiveLinks(section.id);
            }
        });
    });
}

function updateActiveLinks(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkTarget = link.getAttribute('data-target') || link.getAttribute('href').substring(1);
        if (linkTarget === targetId) link.classList.add('active');
        else link.classList.remove('active');
    });
}