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
            window.open('https://IstMate.github.io-main/game_project/game.html', '_blank');
        });
    }
});