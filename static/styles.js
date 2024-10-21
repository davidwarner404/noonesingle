document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterPopup = document.getElementById('newsletterPopup');
    const closePopup = document.getElementById('closePopup');

    // Show popup on page load after 2 seconds
    setTimeout(() => {
        newsletterPopup.style.display = 'flex';
    }, 2000);

    // Close the popup when clicking the close button
    closePopup.addEventListener('click', () => {
        newsletterPopup.style.display = 'none';
    });

    // Handle newsletter form submission
    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(newsletterForm);

        // Send data to Flask backend
        fetch('/subscribe-newsletter', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show success message
            newsletterForm.reset(); // Optionally reset the form
            newsletterPopup.style.display = 'none'; // Hide popup after submission
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error subscribing to the newsletter.');
        });
    });
});


function toggleNav() {
    const navItems = document.getElementById("navItems");
    navItems.classList.toggle("show");
}

// Close the mobile nav when clicking outside
window.onclick = function (event) {
    if (!event.target.matches('.hamburger') && !event.target.matches('.hamburger div')) {
        const navItems = document.getElementById("navItems");
        if (navItems.classList.contains('show')) {
            navItems.classList.remove('show');
        }
    }
}
const genderCheckboxes = document.querySelectorAll('.gender-checkbox');
genderCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        genderCheckboxes.forEach((box) => {
            if (box !== this) {
                box.checked = false;
            }
        });
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');
    const stepIndicators = document.querySelectorAll(".step");
    
    let currentStep = 0;


    // Function to show the current step
    function showStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.classList.toggle('active', index === step);
        });
        stepIndicators.forEach((stepIndicators, index) => {
            stepIndicators.classList.toggle('active', index === step);
        });
    }

    // Validate inputs for each step
    function validateInputs() {
        const genderCheckboxes = document.querySelectorAll('.gender-checkbox');
        const nameInput = document.querySelector('input[name="name"]');
        const dobInput = document.querySelector('input[name="dob"]');
        const emailInput = document.querySelector('input[name="email"]');

        switch (currentStep) {
            case 0:
                // Step 1: Gender
                let genderSelected = false;
                genderCheckboxes.forEach((checkbox) => {
                    if (checkbox.checked) {
                        genderSelected = true;
                    }
                });
                if (!genderSelected) {
                    alert('Please select your gender.'); // Alert if gender is not selected
                    return false;
                }
                break;

            case 1:
                // Step 2: Name
                if (!nameInput.value.trim()) {
                    alert('Please enter your name.'); // Alert if name is not entered
                    return false;
                }
                break;

            case 2:
                // Step 3: Date of Birth
                if (!dobInput.value) {
                    alert('Please select your date of birth.'); // Alert if DOB is not selected
                    return false;
                }
                // Check if the user is at least 18 years old
                const dob = new Date(dobInput.value);
                const today = new Date();
                const age = today.getFullYear() - dob.getFullYear();
                const monthDifference = today.getMonth() - dob.getMonth();
                
                
                if (age < 18) {
                    alert('You must be at least 18 years old.'); // Alert if user is under 18
                    return false;
                }
                break;

            case 3:
                // Step 4: Email
                if (!emailInput.value.trim()) {
                    alert('Please enter your email.'); // Alert if email is not entered
                    return false;
                }
                break;
        }
        return true; // All validations passed
    }

    // Handle next button clicks
    nextBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (validateInputs()) { // Only proceed if validation passes
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    });

    // Handle previous button clicks
    prevBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Handle the submit button click
    submitBtn.addEventListener('click', () => {
        if (validateInputs()) { // Validate before submission
            const formData = new FormData(document.getElementById('multiStepForm'));

            // Send data to Flask backend
            fetch('/submit-form', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Show success message
                // Optionally, reset the form or redirect
                document.getElementById('multiStepForm').reset();
                currentStep = 0; // Reset to the first step
                showStep(currentStep);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });

    // Initialize the first step
    showStep(currentStep);
});

document.addEventListener('DOMContentLoaded', () => {
    const cookieConsentBanner = document.getElementById('cookieConsentBanner');
    const manageCookiesModal = document.getElementById('manageCookiesModal');

    // Check if cookies have already been accepted
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
        cookieConsentBanner.style.display = 'flex'; // Show the cookie consent banner
    }

    // Accept cookies
    document.getElementById('acceptCookies').onclick = function () {
        localStorage.setItem('cookiesAccepted', 'true'); // Store acceptance in local storage
        cookieConsentBanner.style.display = 'none'; // Hide banner
    };

    // Open manage cookies modal
    document.getElementById('manageCookies').onclick = function () {
        manageCookiesModal.style.display = 'flex'; // Show modal
    };

    // Save preferences and close modal
    document.getElementById('savePreferences').onclick = function () {
        const personalisedAds = document.getElementById('personalisedAds').checked;
        const contentMeasurement = document.getElementById('contentMeasurement').checked;
        const audienceResearch = document.getElementById('audienceResearch').checked;

        // Store user preferences in local storage
        localStorage.setItem('personalisedAds', personalisedAds);
        localStorage.setItem('contentMeasurement', contentMeasurement);
        localStorage.setItem('audienceResearch', audienceResearch);

        manageCookiesModal.style.display = 'none'; // Hide modal
    };

    // Close modal
    document.getElementById('closeManageModal').onclick = function () {
        manageCookiesModal.style.display = 'none'; // Hide modal
    };
});

window.onload = function () {
    // Slider variables
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Function to move slider with GSAP animation
    function updateSliderPosition() {
        gsap.to(sliderContainer, {
            x: -currentIndex * 100 + '%',
            duration: 0.2, // Reduced from 0.5 to 0.3 for faster animation
            ease: "power3.out" // Changed from "power2.out" for a smoother effect
        });
    }

    // Next button click handler
    nextBtn.onclick = function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSliderPosition();
    };

    // Previous button click handler
    prevBtn.onclick = function () {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSliderPosition();
    };

    // Touch event handlers for mobile swipe effect
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener('touchend', () => {
        if (startX > endX + 50) {
            nextBtn.onclick();
        } else if (startX < endX - 50) {
            prevBtn.onclick();
        }
    });

    // // Auto-rotate slides every 4 seconds
    // let autoRotate = setInterval(function () {
    //     nextBtn.onclick();
    // }, 4000);

    // // Pause auto-rotation on hover
    // sliderContainer.addEventListener('mouseover', function () {
    //     clearInterval(autoRotate);
    // });

    // // Resume auto-rotation when not hovering
    // sliderContainer.addEventListener('mouseout', function () {
    //     autoRotate = setInterval(function () {
    //         nextBtn.onclick();
    //     }, 4000);
    // });

    // GSAP hover effects for buttons
    const buttonHoverAnimation = (button) => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, { scale: 1.1, duration: 0.2 });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { scale: 1, duration: 0.2 });
        });
    };

    buttonHoverAnimation(prevBtn);
    buttonHoverAnimation(nextBtn);

    // Optional: Fade-in effect for the slider on load
    gsap.from(sliderContainer, {
        opacity: 0,
        duration: 1,
        y: 50,
        ease: "power2.out"
    });


    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Pin the offerpromo section and animate the first and last images on scroll
    gsap.timeline({
        scrollTrigger: {
            trigger: ".first",
            pin: false,  // Pins the section in place
            scrub: true,  // Smooth scrolling based animation
            start: "top bottom",  // Start when the section hits the top
            end: "+=100%",  // End when scrolled past 200% of the viewport
            markers: false,  // For debugging, shows start/end points (can be removed later)
        }
    })
        .fromTo(".first img", { y: "-100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1 })
    // .to(".first img", { x: "100%", opacity: 0, duration: 1 })

    gsap.timeline({
        scrollTrigger: {
            trigger: ".last",
            pin: false,  // Pins the section in place
            scrub: true,  // Smooth scrolling based animation
            start: "top bottom",  // Start when the section hits the top
            end: "+=100%",  // End when scrolled past 200% of the viewport
            markers: false,  // For debugging, shows start/end points (can be removed later)
        }
    })




        .fromTo(".last img", { y: "-100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1 }) // '<' makes it happen simultaneously

    // .to(".last img", { x: "-100%", opacity: 0, duration: 1 })
};



