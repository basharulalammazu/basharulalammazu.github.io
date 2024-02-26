function toggleDarkMode() {
    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains("dark-mode");

    // Toggle dark mode class on the body
    document.body.classList.toggle("dark-mode", !isDarkMode);

    // Update navigation button background color based on mode
    const navbarTogglerIcon = document.querySelector(".navbar-toggler-icon");
    if (navbarTogglerIcon) {
        navbarTogglerIcon.style.backgroundColor = isDarkMode ? "#fff" : "#000";
    }
}

// Call the function to toggle dark mode when needed
// For example, you can call this function when a button or toggle is clicked
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
