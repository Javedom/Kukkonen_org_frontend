export function initEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let cursor = 0;

    document.addEventListener('keydown', (e) => {
        // Reset if key doesn't match expected key in sequence
        if (e.key !== konamiCode[cursor]) {
            // Check if possibly restarting the sequence (e.g., hitting Up after failing)
            cursor = (e.key === konamiCode[0]) ? 1 : 0;
            return;
        }

        // Advance cursor
        cursor++;

        // Check for success
        if (cursor === konamiCode.length) {
            triggerRetroMode();
            cursor = 0; // Reset
        }
    });

    // Mobile/Touch Implementation
    const mobileKonamiCode = ['u', 'u', 'd', 'd', 'l', 'r', 'l', 'r', 't', 't'];
    let inputHistory = [];
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    }, { passive: true });

    function handleGesture(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        const threshold = 30; // Minimum distance for a swipe

        let gesture = '';

        if (absX < 10 && absY < 10) {
            gesture = 't'; // It's a Tap
        } else if (absX > absY && absX > threshold) {
            gesture = diffX > 0 ? 'r' : 'l'; // Horizontal swipe
        } else if (absY > absX && absY > threshold) {
            gesture = diffY > 0 ? 'd' : 'u'; // Vertical swipe
        }

        if (gesture) {
            inputHistory.push(gesture);
            // Keep history only as long as the code
            if (inputHistory.length > mobileKonamiCode.length) {
                inputHistory.shift();
            }

            // Check if match
            // Simple array comparison
            let isMatch = inputHistory.length === mobileKonamiCode.length &&
                inputHistory.every((val, index) => val === mobileKonamiCode[index]);

            if (isMatch) {
                triggerRetroMode();
                inputHistory = []; // Reset after success
            }
        }
    }

    function triggerRetroMode() {
        const html = document.documentElement;

        // Force Light Mode for consistent base
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');

        // Apply Retro Class
        const toggleRetro = () => {
            html.classList.toggle('retro-win95');
            const isActive = html.classList.contains('retro-win95');

            if (isActive) {
                createUndoButton();
                console.log("Welcome to Windows 95!");
            } else {
                removeUndoButton();
            }
        };

        // Use View Transition if available
        if (document.startViewTransition) {
            document.startViewTransition(() => toggleRetro());
        } else {
            toggleRetro();
        }
    }

    function createUndoButton() {
        if (document.getElementById('retro-undo-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'retro-undo-btn';
        btn.innerHTML = '<i class="fas fa-undo mr-2"></i> Exit Windows 95';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            // Use View Transition for exit as well
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    document.documentElement.classList.remove('retro-win95');
                    removeUndoButton();
                });
            } else {
                document.documentElement.classList.remove('retro-win95');
                removeUndoButton();
            }
        });
    }

    function removeUndoButton() {
        const btn = document.getElementById('retro-undo-btn');
        if (btn) btn.remove();
    }
}
