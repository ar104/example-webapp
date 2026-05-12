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

    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in, .reveal-left, .reveal-right, .reveal-up');
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

    // Initialize Leaflet Map
    if (document.getElementById('listings-map')) {
        const map = L.map('listings-map').setView([44.6488, -63.5752], 13); // Centered on Halifax

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Map Listings Data
        const mapListings = [
            {
                lat: 44.6500,
                lng: -63.5800,
                price: "$1,250,000",
                address: "123 Oceanview Dr",
                img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                lat: 44.6400,
                lng: -63.5700,
                price: "$895,000",
                address: "45 South End Ave",
                img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                lat: 44.6300,
                lng: -63.6000,
                price: "$2,100,000",
                address: "88 Northwest Arm Rd",
                img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ];

        // Custom Map Icon (Gold)
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color: #D4AF37; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #0F172A; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Add Markers to Map
        mapListings.forEach(listing => {
            const popupContent = `
                <div class="map-popup-img" style="background-image: url('${listing.img}')"></div>
                <div class="map-popup-details">
                    <h3>${listing.price}</h3>
                    <p>${listing.address}</p>
                    <a href="#contact">Inquire Now</a>
                </div>
            `;

            L.marker([listing.lat, listing.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(popupContent);
        });
    }
});
