// Smooth scrolling and interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactPanel();
    initializeScrollAnimations();
    initializeSolutionCards();
    initializeProcessStrip();
    initializeFormSubmission();
});

// Navigation dots functionality
function initializeNavigation() {
    const dots = document.querySelectorAll('.dot');
    const panels = document.querySelectorAll('.panel');
    
    // Click handlers for dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const panelIndex = parseInt(this.dataset.panel);
            scrollToPanel(panelIndex);
        });
    });
    
    // Update active dot on scroll
    window.addEventListener('scroll', function() {
        let currentPanel = 0;
        
        panels.forEach((panel, index) => {
            const rect = panel.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentPanel = index;
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPanel);
        });
    });
}

// Scroll to specific panel
function scrollToPanel(panelIndex) {
    const panels = document.querySelectorAll('.panel');
    if (panels[panelIndex]) {
        panels[panelIndex].scrollIntoView({ behavior: 'smooth' });
    }
}

// Contact panel functionality
function initializeContactPanel() {
    const contactToggle = document.getElementById('contactToggle');
    const contactPanel = document.getElementById('contactPanel');
    
    if (contactToggle && contactPanel) {
        contactToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            contactPanel.classList.toggle('active');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!contactPanel.contains(e.target) && !contactToggle.contains(e.target)) {
                contactPanel.classList.remove('active');
            }
        });
        
        // Close panel when clicking on a link
        contactPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                contactPanel.classList.remove('active');
            });
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
    
    // Add scroll-animate class to elements that should animate
    const animateElements = [
        '.solution-card',
        '.point-item',
        '.process-step',
        '.contact-card',
        '.metric-card',
        '.feature-item'
    ];
    
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    });
}

// Solution cards interaction
function initializeSolutionCards() {
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        card.addEventListener('click', function() {
            const solution = this.dataset.solution;
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(0, 102, 255, 0.3)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = (event.clientX - rect.left - 10) + 'px';
            ripple.style.top = (event.clientY - rect.top - 10) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add hover sound effect (visual feedback)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Process strip animation
function initializeProcessStrip() {
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.1}s`;
        step.classList.add('scroll-animate');
    });
}

// Form submission
function initializeFormSubmission() {
    const form = document.querySelector('.request-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRequest();
        });
    }
}

function submitRequest() {
    const name = document.getElementById('contactName')?.value;
    const businessType = document.getElementById('businessType')?.value;
    const phone = document.getElementById('contactPhone')?.value;
    
    if (!name || !businessType || !phone) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Validate phone number (Kenyan format)
    const phoneRegex = /^(?:\+254|0)?[7]\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showNotification('Please enter a valid Kenyan phone number', 'error');
        return;
    }
    
    // Create message for WhatsApp
    const message = `Hello Byteflow Solutions! I'd like to request a system:\n\nName: ${name}\nBusiness Type: ${businessType}\nPhone: ${phone}\n\nI'm interested in your software solutions.`;
    const whatsappUrl = `https://wa.me/254799786754?text=${encodeURIComponent(message)}`;
    
    // Show success message
    showNotification('Redirecting to WhatsApp...', 'success');
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        // Clear form
        document.getElementById('contactName').value = '';
        document.getElementById('businessType').value = '';
        document.getElementById('contactPhone').value = '';
    }, 1000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '9999';
    notification.style.transform = 'translateX(400px)';
    notification.style.transition = 'transform 0.3s ease';
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            margin-left: -90px;
            margin-top: -90px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentPanel = getCurrentPanel();
        if (currentPanel < document.querySelectorAll('.panel').length - 1) {
            scrollToPanel(currentPanel + 1);
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentPanel = getCurrentPanel();
        if (currentPanel > 0) {
            scrollToPanel(currentPanel - 1);
        }
    }
});

function getCurrentPanel() {
    const panels = document.querySelectorAll('.panel');
    let currentPanel = 0;
    
    panels.forEach((panel, index) => {
        const rect = panel.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentPanel = index;
        }
    });
    
    return currentPanel;
}

// Parallax effect for intro section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const introPanel = document.querySelector('.intro-panel');
    const codeBlock = document.querySelector('.code-block');
    
    if (introPanel && codeBlock) {
        const rect = introPanel.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const speed = 0.5;
            codeBlock.style.transform = `translateY(${scrolled * speed}px)`;
        }
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate elements on load
    const introElements = document.querySelectorAll('.intro-content > *');
    introElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        const currentPanel = getCurrentPanel();
        const panels = document.querySelectorAll('.panel');
        
        if (diff > 0 && currentPanel < panels.length - 1) {
            // Swipe up - next panel
            scrollToPanel(currentPanel + 1);
        } else if (diff < 0 && currentPanel > 0) {
            // Swipe down - previous panel
            scrollToPanel(currentPanel - 1);
        }
    }
}

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handlers
const debouncedScrollHandler = debounce(function() {
    // Handle scroll-based animations
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Add/remove scrolled class to body for header effects
    if (scrolled > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add CSS for loaded state
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body.loaded .panel {
        opacity: 1;
    }
    
    body.scrolled .nav-dot {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    }
    
    body.scrolled .contact-fab {
        transform: scale(1);
    }
`;
document.head.appendChild(loadedStyle);
