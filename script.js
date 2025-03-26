document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const navbarTogglerIcon = document.querySelector('.navbar-toggler-icon');
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Dark Mode Toggle
    function toggleDarkMode(e) {
        body.classList.toggle('dark-mode', e.matches);
        if (navbarTogglerIcon) {
            navbarTogglerIcon.classList.toggle('light-mode', !e.matches);
            navbarTogglerIcon.classList.toggle('dark-mode', e.matches);
        }

        if (e.matches) {
            document.querySelector('nav').style.background = 'linear-gradient(135deg, #2d2d2d, #444)';
            document.querySelector('footer').style.background = 'linear-gradient(135deg, rgb(45, 45, 45), rgb(68, 68, 68))';
        } else {
            document.querySelector('nav').style.background = 'linear-gradient(135deg, #ffffff, #e9ecef)';
            document.querySelector('footer').style.background = 'linear-gradient(135deg, rgb(45, 45, 45), rgb(68, 68, 68))';
        }
    }
    toggleDarkMode(darkModeMediaQuery);
    darkModeMediaQuery.addListener(toggleDarkMode);

    // Highlight active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Project Filter (only applicable on projects.html)
    if (document.querySelector('.project-filter-btn')) {
        const filterButtons = document.querySelectorAll('.project-filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                // Animate items
                projectItems.forEach((item, index) => {
                    const category = item.getAttribute('data-category');
                    const isVisible = filter === 'all' || category === filter;

                    if (isVisible) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100); // Stagger by 100ms per item
                    } else {
                        item.classList.remove('visible');
                        setTimeout(() => {
                            if (!item.classList.contains('visible')) {
                                item.style.display = 'none';
                            }
                        }, 500); // Match CSS transition duration
                    }
                });
            });
        });

        // Trigger initial filter (All)
        filterButtons[0].click();
    }

    // Back-to-Top Button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);
    window.addEventListener('scroll', () => {
        backToTop.style.opacity = window.scrollY > 300 ? '1' : '0';
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Inject Back-to-Top CSS
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #042C3E, rgb(43, 43, 150));
                color: #fff;
                border: none;
                border-radius: 50%;
                font-size: 28px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            .back-to-top:hover {
                transform: scale(1.2) rotate(360deg);
                background: linear-gradient(135deg, rgb(238, 168, 255), #9C4EAF);
            }
        </style>
    `);

    // Set the current year in the footer
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});