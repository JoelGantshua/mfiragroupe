// Initialize slider immediately if DOM is ready, otherwise wait
function initializeApp() {
    // ========== Mobile Menu Toggle ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 767 && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
    
    // Close mobile menu when clicking outside or on overlay
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
            if (navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                }
            }
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Handle window resize to close mobile menu if switching to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // ========== Sticky Header with Scroll Effect ==========
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up', 'scroll-down');
            return;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            header.classList.remove('scroll-up', 'scroll-down');
        }, 150);
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // ========== Hero Slider ==========
    function initHeroSlider() {
        const heroSlider = document.querySelector('.hero-slider');
        const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
        let slideInterval = null;
        
        if (!heroSlider || slides.length === 0) {
            console.log('Hero slider or slides not found, retrying...');
            // Retry after a short delay
            setTimeout(initHeroSlider, 100);
            return;
        }
        
        console.log('Hero slider initialized with', slides.length, 'slides');
    
    function showSlide(index) {
            // Ensure index is within bounds
            if (index < 0) {
                index = slides.length - 1;
            }
            if (index >= slides.length) {
                index = 0;
            }
            
            // Remove active class from all slides
            slides.forEach((slide) => {
            slide.classList.remove('active');
            });
            
            // Add active class to current slide
            if (slides[index]) {
                slides[index].classList.add('active');
                currentSlide = index;
                console.log('Showing slide', index + 1, 'of', slides.length);
            }
        }
        
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }
        
        function prevSlide() {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }
        
        // Initialize first slide
        showSlide(0);
        
        // Auto slide every 5 seconds
        if (slides.length > 1) {
            slideInterval = setInterval(function() {
                nextSlide();
            }, 5000);
            console.log('Auto-slide started: 5 seconds interval');
        }
        
        // Pause on hover
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', function() {
                if (slideInterval) {
                    clearInterval(slideInterval);
                    slideInterval = null;
                    console.log('Slider paused on hover');
                }
            });
            
            hero.addEventListener('mouseleave', function() {
                if (slides.length > 1 && !slideInterval) {
                    slideInterval = setInterval(function() {
                        nextSlide();
                    }, 5000);
                    console.log('Slider resumed');
                }
            });
        }
        
        // Keyboard navigation (optional)
        document.addEventListener('keydown', function(e) {
            if (hero && document.querySelector('.hero:hover')) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    if (slideInterval) {
                        clearInterval(slideInterval);
                        slideInterval = setInterval(function() {
                            nextSlide();
                        }, 5000);
                    }
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    if (slideInterval) {
                        clearInterval(slideInterval);
                        slideInterval = setInterval(function() {
                            nextSlide();
                        }, 5000);
                    }
                }
            }
        });
    }
    
    // Initialize slider after DOM is fully loaded
    initHeroSlider();
    
    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ========== Animate on Scroll (Enhanced) ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.service-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ========== Back to Top Button ==========
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ========== Counter Animation ==========
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }
    
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // ========== Parallax Effect for Hero ==========
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = heroSection.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }, { passive: true });
    }
    
    // ========== Form Validation Enhancement ==========
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // ========== Lazy Loading Images ==========
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ========== Active Navigation Link Highlighting ==========
    const sections = document.querySelectorAll('section[id]');
    const anchorNavLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (sections.length > 0 && anchorNavLinks.length > 0) {
        function highlightActiveSection() {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    anchorNavLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', highlightActiveSection, { passive: true });
    }
    
    // ========== Initialize AOS if available ==========
    if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0
        });
    }
    
    // ========== Service Card Hover Effects ==========
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ========== Preloader (if exists) ==========
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Hide preloader immediately if content is already loaded
        if (document.readyState === 'complete') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        } else {
            window.addEventListener('load', () => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            });
        }
    }
    
    // ========== Console Welcome Message ==========
    console.log('%cAG Groupe Officiel', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cSite web moderne et professionnel', 'font-size: 12px; color: #64748b;');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}
