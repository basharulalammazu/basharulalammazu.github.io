// Function to toggle dark mode
function toggleDarkMode() {
    const icon = document.getElementById('navbar-toggler-icon');
    // Check if dark mode is enabled
    const darkModeEnabled = /* Your logic to determine dark mode state */;
    // Toggle classes based on dark mode state
    if (darkModeEnabled) {
        icon.classList.remove('light-mode');
        icon.classList.add('dark-mode');
    } else {
        icon.classList.remove('dark-mode');
        icon.classList.add('light-mode');
    }
}

// Call the function when needed
toggleDarkMode();




// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Highlight navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const id = section.getAttribute('id');

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`).classList.add('active');
        }
    });
});

// Show active section on page load
window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const id = section.getAttribute('id');

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`).classList.add('active');
        }
    });
});

// Function to toggle active section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}


// JavaScript code to toggle button color based on dark mode

// Assuming you have a variable darkMode that indicates whether dark mode is active
const darkMode = true; // Set this variable based on your logic

// Select the button element
const navbarToggleBtn = document.getElementById('navbarToggleBtn');

// Function to toggle button color based on dark mode
function toggleButtonColor() {
    if (darkMode) {
        // Apply dark mode styles
        navbarToggleBtn.style.backgroundColor = '#333'; // Set background color to dark gray
        navbarToggleBtn.style.color = '#eee'; // Set text color to white
    } else {
        // Apply light mode styles
        navbarToggleBtn.style.backgroundColor = '#fff'; // Set background color to white
        navbarToggleBtn.style.color = '#333'; // Set text color to dark gray
    }
}

// Call the function initially to set the button color based on the initial mode
toggleButtonColor();
