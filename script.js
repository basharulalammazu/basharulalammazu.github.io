document.addEventListener("DOMContentLoaded", function () {
    // Preloader
    window.addEventListener('load', () => {
    document.getElementById('preloader').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
    }, 500);
});
   
const body = document.body;
const navbarTogglerIcon = document.querySelector('.navbar-toggler-icon');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
   
// Dark Mode Toggle
function toggleDarkMode(e) {
    body.classList.toggle('dark-mode', e.matches);
    navbarTogglerIcon.style.backgroundColor = e.matches ? '#333' : '#fff';
    if (e.matches) {
        document.querySelector('nav').style.background = 'linear-gradient(135deg, #2d2d2d, #444)';
        document.querySelector('footer').style.background = 'linear-gradient(135deg, rgb(45, 45, 45), rgb(68, 68, 68));';
    } else {
        document.querySelector('nav').style.background = 'linear-gradient(135deg, #ffffff, #e9ecef)';
        document.querySelector('footer').style.background = 'linear-gradient(135deg, rgb(45, 45, 45), rgb(68, 68, 68))';
    }
}
toggleDarkMode(darkModeMediaQuery);
    darkModeMediaQuery.addListener(toggleDarkMode);
   
    // Smooth Scroll and Section Toggle
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.querySelector(`#${targetId}`);
            if (targetSection) {
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                    section.style.opacity = '0';
                });
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.style.transition = 'opacity 0.5s ease';
                    targetSection.style.opacity = '1';
                }, 10);
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                    history.pushState(null, null, `#${targetId}`);
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
                    document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
   
    // Project Filter with Animation
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
   
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });
    filterButtons[0].click();
   
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
                background: linear-gradient(135deg, #042C3E,rgb(43, 43, 150));
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
                background: linear-gradient(135deg,rgb(238, 168, 255), #9C4EAF);
            }
        </style>
    `);
});



// Get the current year
const currentYear = new Date().getFullYear();
// Insert the year into the span element
document.getElementById("year").textContent = currentYear;