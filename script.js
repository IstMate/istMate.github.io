// AOS init for slide-from-left
AOS.init({ duration: 800, once: true });

// Nav: Add active class for current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.style.color = '#D7A758'; // Highlight
        }
    });

    // Fullscreen for drawing iframe
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const drawingIframe = document.getElementById('drawing-iframe');
    if (fullscreenBtn && drawingIframe) {
        fullscreenBtn.addEventListener('click', () => {
            if (drawingIframe.requestFullscreen) {
                drawingIframe.requestFullscreen();
            } else if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        });
    }

    // Start game in new page
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            window.open('https://IstMate.github.io/game_project/game.html', '_blank');
        });
    }
});

(function setVh() {
    function updateVh() {
        // 1% of the viewport height, accounting for mobile browser bars
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    updateVh();

    // Recalculate when device orientation or window size changes
    window.addEventListener('resize', updateVh, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(updateVh, 250), { passive: true });
})();