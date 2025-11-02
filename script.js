document.addEventListener("DOMContentLoaded", function() {

    // === 1. Typing Animation ===
    const typingText = document.getElementById("typing-text");
    const roles = [
        "a CS Student.",
        "an E-Cell President.",
        "a TechAstra Lead.",
        "a Community Builder.",
        "an IITB Campus Ambassador."
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Deleting text
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        } else {
            // Typing text
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                // Pause at end of word
                setTimeout(type, 1500); 
                return;
            }
        }
        
        const typeSpeed = isDeleting ? 75 : 150;
        setTimeout(type, typeSpeed);
    }
    type(); // Start the typing effect


    // === 2. Experience Tabs ===
    // This is handled by inline `onclick` functions in the HTML,
    // so we just need the function definition.
    window.openTab = function(evt, tabName) {
        // Get all elements with class="tab-content" and hide them
        const tabcontent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tab-link" and remove the "active" class
        const tablinks = document.getElementsByClassName("tab-link");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }


    // === 3. Fade-on-Scroll Animation ===
    const scrollElements = document.querySelectorAll(".scroll-animate");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("visible");
    };

    const hideScrollElement = (element) => {
        element.classList.remove("visible");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    }

    // Initial check on load
    handleScrollAnimation();
    
    // Check on scroll
    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });

    // === 4. Mobile navigation toggle ===
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar nav a');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close mobile nav when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('open')) {
                    navbar.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

});