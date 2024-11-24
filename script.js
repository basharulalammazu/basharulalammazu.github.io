document.addEventListener("DOMContentLoaded", function() {
    const navbarTogglerIcon = document.querySelector('.navbar-toggler-icon');

    // Check if dark mode is enabled
    const darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Function to toggle dark mode
    function toggleDarkMode() {
        if (darkModeEnabled) {
            // Dark mode
            navbarTogglerIcon.style.backgroundColor = "#333";
        } else {
            // Light mode
            navbarTogglerIcon.style.backgroundColor = "#fff"; // Change to light mode background color
        }
    }

    // Call the function to initially set the color based on the mode
    toggleDarkMode();

    // Listen for changes in color scheme
    window.matchMedia('(prefers-color-scheme: dark)').addListener(toggleDarkMode);

    // Function to highlight the active navigation link
    function highlightActiveLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const id = section.getAttribute('id');

            // Check if the current scroll position is within the section's range
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = id; // Update the current section ID
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1); // Remove the #
            if (href === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Highlight navigation links based on scroll position
    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Initial call to set the active link based on current scroll position

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href'); // Get target ID from href
            const targetSection = document.querySelector(targetId); // Get target section

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Update URL without adding to history
                history.pushState(null, null, targetId); // Change URL to targetId without reloading

                // Collapse the navbar after clicking a link (if applicable)
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // Function to show active section on page load
    function showActiveSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const id = section.getAttribute('id');

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Show active section on page load
    window.addEventListener('DOMContentLoaded', showActiveSection);

    // Function to toggle active section
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }
});

// JavaScript for image swapping
document.addEventListener("DOMContentLoaded", function () {
    // Function to handle slideshow for each project
    function startSlideshow(containerId) {
        const container = document.getElementById(containerId);
        const images = container.querySelectorAll('.project-img');
        let currentIndex = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }

        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
            currentIndex = nextIndex;
        }

        // Initially, show the first image
        showImage(currentIndex);

        // Change image every 3 seconds
        setInterval(nextImage, 3000);
    }

    // Start slideshow for each project
    startSlideshow('project1-slideshow');
    startSlideshow('project2-slideshow');
    startSlideshow('project3-slideshow');
});
