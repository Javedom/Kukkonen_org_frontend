export function initScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const floatingChatBtn = document.querySelector('.floating-chat-btn');
    const chatSection = document.getElementById('chat');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;

        // Buttons Visibility
        const isScrolled = window.scrollY > 500;
        let isChatVisible = false;

        if (chatSection) {
            const rect = chatSection.getBoundingClientRect();
            isChatVisible = (rect.top < window.innerHeight && rect.bottom >= 0);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', isScrolled);
        }

        if (floatingChatBtn) {
            const shouldShow = isScrolled && !isChatVisible;
            floatingChatBtn.classList.toggle('visible', shouldShow);
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

export function initTheme() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;

    // Haetaan vain aiemmin tallennettu valinta, ei käyttöjärjestelmän asetusta
    const savedTheme = localStorage.getItem('theme');

    // Tarkistus: Jos käyttäjä on NIMENOMAAN valinnut aiemmin 'dark', käytetään sitä.
    // Muussa tapauksessa (uusi kävijä tai ei valintaa) pakotetaan Light-teema.
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        updateIcons(true);
    } else {
        // Tämä lohko suoritetaan nyt oletuksena kaikille uusille kävijöille
        // riippumatta heidän laitteensa asetuksista.
        html.classList.remove('dark');
        updateIcons(false);
    }

    // Attach Listeners
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Function to enact the toggle
            const toggleTheme = () => {
                const isDark = html.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                updateIcons(isDark);
            };

            // Check if View Transition API is supported
            if (!document.startViewTransition) {
                toggleTheme();
                return;
            }

            // Get click coordinates
            const x = e.clientX;
            const y = e.clientY;

            // Calculate max radius to cover the entire screen
            const endRadius = Math.hypot(
                Math.max(x, innerWidth - x),
                Math.max(y, innerHeight - y)
            );

            // Start the transition
            const transition = document.startViewTransition(() => {
                toggleTheme();
            });

            // Wait for the pseudo-elements to be created
            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ];

                // Animate the incoming view (New) expanding
                document.documentElement.animate(
                    {
                        clipPath: clipPath,
                    },
                    {
                        duration: 500,
                        easing: 'ease-in-out',
                        pseudoElement: '::view-transition-new(root)',
                    }
                );
            });
        });
    });

    function updateIcons(isDark) {
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (!icon) return;

            if (isDark) {
                icon.className = 'fas fa-sun';
                btn.setAttribute('title', 'Vaihda vaaleaan teemaan');
            } else {
                icon.className = 'fas fa-moon';
                btn.setAttribute('title', 'Vaihda tummaan teemaan');
            }
        });
    }
}