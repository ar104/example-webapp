document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in, .reveal-left, .reveal-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Trigger hero animations immediately on load
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach(el => el.classList.add('visible'));
    }, 100);

    // Form Submission Handling
    const leadForm = document.getElementById('lead-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset status
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        // Get form data
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());
        
        // Basic Validation (HTML5 already does most of this)
        if (!data.name || !data.email || !data.interest) {
            formStatus.textContent = 'Please fill out all required fields.';
            formStatus.classList.add('error');
            return;
        }

        // Change button state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                formStatus.textContent = 'Thank you! Your inquiry has been sent successfully.';
                formStatus.classList.add('success');
                leadForm.reset();
            } else {
                throw new Error(result.error || 'Failed to send inquiry.');
            }
        } catch (error) {
            formStatus.textContent = error.message;
            formStatus.classList.add('error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});
