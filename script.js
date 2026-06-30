// CalmSpace Website - Main JavaScript
// Pure vanilla JavaScript, no frameworks

document.addEventListener('DOMContentLoaded', function() {
  initializeFAQ();
  initializeForm();
  initializeScrollBehavior();
});

/**
 * Initialize FAQ accordion functionality
 */
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
          }
        });
        
        // Toggle current item
        item.classList.toggle('open');
      });
    }
  });
}

/**
 * Initialize contact form
 */
function initializeForm() {
  const form = document.querySelector('form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Submit form (using Formspree or similar)
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // For production, replace with actual form submission endpoint
    // This is a placeholder that simulates successful submission
    setTimeout(() => {
      showNotification('Thank you! We\'ll get back to you soon.', 'success');
      form.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }, 1000);
  });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#0a7ea4'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
    max-width: 90%;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Validate email address
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Initialize smooth scroll behavior
 */
function initializeScrollBehavior() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Add animation styles dynamically
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Log initialization
console.log('CalmSpace website initialized');
