document.addEventListener("DOMContentLoaded", function () {
  // --- Typing Animation for Hero Section ---
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  // Customize these roles
  const textArray = [
    "Computer Vision Engineer",
    "AI Enthusiast",
    "Deep Learning Practitioner",
    "Innovator",
  ];
  const typingDelay = 100; // Milliseconds per character typed
  const erasingDelay = 50; // Milliseconds per character erased
  const newTextDelay = 2000; // Delay before typing new text (milliseconds)

  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      if (!cursorSpan.classList.contains("typing"))
        cursorSpan.classList.add("typing");
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      if (!cursorSpan.classList.contains("typing"))
        cursorSpan.classList.add("typing");
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1
      );
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 1100); // Delay before typing starts again
    }
  }

  // Start the typing animation after a small delay
  if (textArray.length) setTimeout(type, newTextDelay + 250);

  // --- Sticky Navbar & Scroll Effects ---
  const header = document.querySelector(".main-header");
  const navbarLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section");

  window.addEventListener("scroll", () => {
    // Add/remove 'scrolled' class to header
    if (window.scrollY > 50) {
      // Adjust this value as needed
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Highlight active navigation link based on scroll position
    let current = "";
    sections.forEach((section) => {
      // Get sectionTop and sectionHeight relative to the viewport after header height
      const sectionTop = section.offsetTop - header.offsetHeight;
      const sectionHeight = section.clientHeight;
      if (
        pageYOffset >= sectionTop &&
        pageYOffset < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navbarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.href.includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav-active");
    menuToggle.classList.toggle("toggle"); // For hamburger to 'X' animation

    // Staggered animation for links (if active)
    navLinks.querySelectorAll("li").forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ""; // Reset animation if already active
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.3
        }s`;
      }
    });
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("nav-active")) {
        navLinks.classList.remove("nav-active");
        menuToggle.classList.remove("toggle");
        // Reset animation state for links
        navLinks.querySelectorAll("li").forEach((item) => {
          item.style.animation = "";
        });
      }
    });
  });

  // Close mobile menu if clicked outside (optional, but good UX)
  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target) &&
      navLinks.classList.contains("nav-active")
    ) {
      navLinks.classList.remove("nav-active");
      menuToggle.classList.remove("toggle");
      navLinks.querySelectorAll("li").forEach((item) => {
        item.style.animation = "";
      });
    }
  });

  // --- Project Filtering Logic ---
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove 'active' from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add 'active' to the clicked button
      button.classList.add("active");

      const selectedCategory = button.dataset.category;

      projectCards.forEach((card) => {
        const cardCategories = card.dataset.categories
          ? card.dataset.categories.split(",")
          : [];

        if (
          selectedCategory === "all" ||
          cardCategories.includes(selectedCategory)
        ) {
          // Show card with a subtle delay to allow CSS transition
          // This delay ensures the element is in the DOM flow before opacity/transform starts
          setTimeout(() => {
            card.classList.remove("hidden");
            card.style.position = "relative"; // Bring back to normal flow
            card.style.width = ""; // Reset width
          }, 0);
        } else {
          // Hide card
          card.classList.add("hidden");
          // Delay setting position:absolute to allow opacity/transform transition to start
          setTimeout(() => {
            card.style.position = "absolute"; // Take out of flow
            card.style.width = card.offsetWidth + "px"; // Maintain current width before absolute
          }, 500); // Match this delay to your CSS transition duration (e.g., 0.5s = 500ms)
        }
      });
    });
  });

  // --- Skill Item Scroll Animation ---
  const skillItems = document.querySelectorAll(".skill-item");

  const observerOptions = {
    root: null, // null means the viewport
    rootMargin: "0px",
    threshold: 0.2, // Trigger when 20% of the item is visible
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When element enters viewport
        // You can add a data-delay attribute to your HTML skill items for staggered animation
        // e.g., <div class="skill-item" data-delay="100">
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add("fade-in");
        }, delay);
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  skillItems.forEach((item) => {
    skillObserver.observe(item);
  });

  // --- Contact Form Validation ---
  const contactForm = document.querySelector(".contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageTextarea = document.getElementById("message");

  // Helper function to show validation error
  function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.remove("is-valid");
    formGroup.classList.add("is-invalid");
    let small = formGroup.querySelector("small");
    if (!small) {
      // Create small tag if it doesn't exist
      small = document.createElement("small");
      formGroup.appendChild(small);
    }
    small.innerText = message;
  }

  // Helper function to show validation success
  function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove("is-invalid");
    formGroup.classList.add("is-valid");
    const small = formGroup.querySelector("small");
    if (small) {
      // Remove error message if it exists
      small.innerText = "";
    }
  }

  // Check email is valid
  function isValidEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Event listener for form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent actual form submission for client-side validation first

    let formIsValid = true; // Assume valid until proven otherwise

    // Validate Name
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Name is required");
      formIsValid = false;
    } else {
      showSuccess(nameInput);
    }

    // Validate Email
    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
      formIsValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Email is not valid");
      formIsValid = false;
    } else {
      showSuccess(emailInput);
    }

    // Validate Message
    if (messageTextarea.value.trim() === "") {
      showError(messageTextarea, "Message is required");
      formIsValid = false;
    } else {
      showSuccess(messageTextarea);
    }

    // If all client-side checks pass, submit the form
    if (formIsValid) {
      // Show loading state
      const submitBtn = contactForm.querySelector('.btn[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Submit form data using fetch to Formspree
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Success
            alert("Thank you for your message! I'll get back to you soon.");
            contactForm.reset(); // Clear the form fields after submission
            // Reset validation states
            nameInput.parentElement.classList.remove("is-valid", "is-invalid");
            emailInput.parentElement.classList.remove("is-valid", "is-invalid");
            messageTextarea.parentElement.classList.remove(
              "is-valid",
              "is-invalid"
            );
            // Clear any error messages
            document.querySelectorAll(".form-group small").forEach((small) => {
              small.innerText = "";
            });
          } else {
            response.json().then((data) => {
              if (Object.hasOwnProperty.call(data, "errors")) {
                alert(
                  "Oops! There was a problem submitting your form: " +
                    data.errors.map((error) => error.message).join(", ")
                );
              } else {
                alert(
                  "Oops! There was a problem submitting your form. Please try again."
                );
              }
            });
          }
        })
        .catch((error) => {
          alert(
            "Oops! There was a problem submitting your form. Please check your internet connection and try again."
          );
        })
        .finally(() => {
          // Reset button state
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    }
  });

  // Optional: Add real-time validation on input blur (when user clicks out of a field)
  nameInput.addEventListener("blur", () => {
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Name is required");
    } else {
      showSuccess(nameInput);
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Email is not valid");
    } else {
      showSuccess(emailInput);
    }
  });

  messageTextarea.addEventListener("blur", () => {
    if (messageTextarea.value.trim() === "") {
      showError(messageTextarea, "Message is required");
    } else {
      showSuccess(messageTextarea);
    }
  });
});
