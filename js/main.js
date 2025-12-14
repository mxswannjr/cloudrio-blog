// Security monitoring
window.addEventListener('securitypolicyviolation', (event) => {
    console.error('CSP Violation:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber
    });
    
    // In production, send to security monitoring service
    // sendSecurityEvent(event);
});

// Performance monitoring
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const loadTime = perfData.loadEventEnd - perfData.loadEventEnd;
    console.log('Page Load Time:', loadTime + 'ms');
    
    // In production, send to analytics
    // sendPerformanceData({
    //     loadTime,
    //     domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    //     firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
    //     firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime
    // });
});

// Sample blog posts data - Rio themed
const blogPosts = [
    {
        id: 1,
        title: "FINDING MY VOICE",
        category: "Personal Growth",
        excerpt: "Learning to speak my truth and share my perspective with the world, one post at a time.",
        content: "For years, I wondered if my thoughts mattered. If my perspective was valuable. I've learned that everyone has a unique viewpoint worth sharing. This is my journey of finding confidence in my own voice and embracing the power of authentic expression.",
        author: "Rio",
        date: "2024-01-15",
        readTime: "5 min read",
        image: "https://picsum.photos/seed/voice/400/200.jpg"
    },
    {
        id: 2,
        title: "THE BEAUTY OF SIMPLICITY",
        category: "Lifestyle",
        excerpt: "How minimalism and intentional living have transformed my daily experience and mental clarity.",
        content: "In a world of constant noise and complexity, I've found profound peace in simplicity. This isn't about having less - it's about making room for what truly matters. Here's how minimal design principles have reshaped not just my space, but my mindset.",
        author: "Rio",
        date: "2024-01-12",
        readTime: "6 min read",
        image: "https://picsum.photos/seed/simple/400/200.jpg"
    },
    {
        id: 3,
        title: "CREATIVITY IN THE DIGITAL AGE",
        category: "Technology",
        excerpt: "Exploring how technology can both enhance and challenge our creative processes.",
        content: "Digital tools have revolutionized how we create, but they've also created new pressures and distractions. I've been experimenting with finding the right balance between leveraging technology and maintaining authentic human creativity in my work.",
        author: "Rio",
        date: "2024-01-10",
        readTime: "7 min read",
        image: "https://picsum.photos/seed/digital/400/200.jpg"
    },
    {
        id: 4,
        title: "BUILDING MEANINGFUL CONNECTIONS",
        category: "Relationships",
        excerpt: "Quality over quantity - my approach to friendships and community in the modern world.",
        content: "Social media promised connection but often delivers isolation. I've been focusing on building deeper, more meaningful relationships - both online and offline. Here's what I've learned about authentic connection in a digital world.",
        author: "Rio",
        date: "2024-01-08",
        readTime: "8 min read",
        image: "https://picsum.photos/seed/connections/400/200.jpg"
    },
    {
        id: 5,
        title: "THE JOURNEY OF SELF-DISCOVERY",
        category: "Philosophy",
        excerpt: "Embracing the messy, beautiful process of figuring out who I am and who I want to become.",
        content: "Self-discovery isn't a destination - it's a continuous journey of questioning, learning, and growing. I'm sharing my experiences with identity, purpose, and the courage it takes to keep evolving as a person.",
        author: "Rio",
        date: "2024-01-05",
        readTime: "9 min read",
        image: "https://picsum.photos/seed/discovery/400/200.jpg"
    },
    {
        id: 6,
        title: "FINDING BALANCE IN CHAOS",
        category: "Wellness",
        excerpt: "My strategies for maintaining mental health and inner peace in an overwhelming world.",
        content: "Between work, social obligations, and the constant stream of information, finding balance feels impossible sometimes. I've developed practical strategies that help me stay grounded and centered, even when life gets chaotic.",
        author: "Rio",
        date: "2024-01-03",
        readTime: "6 min read",
        image: "https://picsum.photos/seed/balance/400/200.jpg"
    }
];

// DOM Elements
const blogGrid = document.getElementById('blog-posts');
const loadMoreBtn = document.getElementById('load-more-btn');
const contactForm = document.getElementById('contact-form');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// State
let postsToShow = 3;
let currentPosts = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderBlogPosts();
    setupEventListeners();
    setupSmoothScrolling();
    addScrollAnimations();
});

// Render blog posts - OPTIMIZED VERSION
function renderBlogPosts() {
    try {
        currentPosts = blogPosts.slice(0, postsToShow);
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        currentPosts.forEach((post, index) => {
            const postElement = createBlogPostElement(post);
            postElement.style.animationDelay = `${index * 0.1}s`;
            postElement.classList.add('fade-in-up');
            fragment.appendChild(postElement);
        });
        
        // Single DOM operation for better performance
        blogGrid.innerHTML = '';
        blogGrid.appendChild(fragment);
        
        // Hide load more button if all posts are shown
        if (postsToShow >= blogPosts.length) {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error rendering blog posts:', error);
        showNotification('Unable to load blog posts', 'error');
    }
}

// Security helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sanitizeUrl(url) {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol) ? url : '';
    } catch {
        return '';
    }
}

function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}

// Create blog post element (SECURE VERSION)
function createBlogPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    
    // Create image element safely
    const img = document.createElement('img');
    img.src = sanitizeUrl(post.image);
    img.alt = escapeHtml(post.title);
    img.className = 'blog-post-image';
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'blog-post-content';
    
    // Create category span
    const category = document.createElement('span');
    category.className = 'blog-post-category';
    category.textContent = post.category;
    
    // Create title
    const title = document.createElement('h3');
    title.className = 'blog-post-title';
    title.textContent = post.title;
    
    // Create excerpt
    const excerpt = document.createElement('p');
    excerpt.className = 'blog-post-excerpt';
    excerpt.textContent = post.excerpt;
    
    // Create meta container
    const meta = document.createElement('div');
    meta.className = 'blog-post-meta';
    
    // Create read time span
    const readTime = document.createElement('span');
    readTime.textContent = post.readTime;
    
    // Create read more link
    const readMore = document.createElement('a');
    readMore.href = '#';
    readMore.className = 'read-more';
    readMore.textContent = 'Read More →';
    readMore.dataset.postId = post.id;
    
    // Assemble the elements
    meta.appendChild(readTime);
    meta.appendChild(readMore);
    
    content.appendChild(category);
    content.appendChild(title);
    content.appendChild(excerpt);
    content.appendChild(meta);
    
    article.appendChild(img);
    article.appendChild(content);
    
    return article;
}

// Setup event listeners
function setupEventListeners() {
    // Load more posts
    loadMoreBtn.addEventListener('click', function() {
        postsToShow = Math.min(postsToShow + 3, blogPosts.length);
        renderBlogPosts();
    });
    
    // Read more links
    blogGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('read-more')) {
            e.preventDefault();
            const postId = parseInt(e.target.dataset.postId);
            showFullPost(postId);
        }
    });
    
    // Contact form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactForm();
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Add keyboard support for mobile menu
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive.toString());
        }
    });
}

// Show full blog post (modal or expand) - SECURE VERSION
function showFullPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    
    // Create modal content safely
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = '×';
    
    // Create image
    const modalImage = document.createElement('img');
    modalImage.src = sanitizeUrl(post.image);
    modalImage.alt = escapeHtml(post.title);
    modalImage.className = 'modal-image';
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Create category
    const category = document.createElement('span');
    category.className = 'blog-post-category';
    category.textContent = post.category;
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = post.title;
    
    // Create post meta
    const postMeta = document.createElement('div');
    postMeta.className = 'post-meta';
    
    const authorSpan = document.createElement('span');
    authorSpan.textContent = `By ${post.author}`;
    
    const dateSpan = document.createElement('span');
    dateSpan.textContent = formatDate(post.date);
    
    const readTimeSpan = document.createElement('span');
    readTimeSpan.textContent = post.readTime;
    
    postMeta.appendChild(authorSpan);
    postMeta.appendChild(dateSpan);
    postMeta.appendChild(readTimeSpan);
    
    // Create post content
    const postContent = document.createElement('div');
    postContent.className = 'post-content';
    
    const contentPara1 = document.createElement('p');
    contentPara1.textContent = post.content;
    
    const contentPara2 = document.createElement('p');
    contentPara2.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    
    const contentPara3 = document.createElement('p');
    contentPara3.textContent = 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    
    postContent.appendChild(contentPara1);
    postContent.appendChild(contentPara2);
    postContent.appendChild(contentPara3);
    
    // Assemble modal
    modalBody.appendChild(category);
    modalBody.appendChild(title);
    modalBody.appendChild(postMeta);
    modalBody.appendChild(postContent);
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalBody);
    
    modal.appendChild(modalContent);
    
    // Add modal styles
    const modalStyles = `
        .post-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-light);
            z-index: 10;
        }
        
        .modal-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .post-meta {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .post-content {
            line-height: 1.8;
            color: var(--text-dark);
        }
        
        .post-content p {
            margin-bottom: 1.5rem;
        }
    `;
    
    // Add styles to head if not already added
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Escape key to close
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Enhanced validation functions
function validateName(name) {
    return name.trim().length >= 2 && name.trim().length <= 50;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMessage(message) {
    return message.trim().length >= 10 && message.trim().length <= 1000;
}

// Handle contact form submission - SECURE VERSION
function handleContactForm() {
    try {
        const formData = new FormData(contactForm);
        let name = sanitizeInput(formData.get('name'));
        let email = sanitizeInput(formData.get('email'));
        let message = sanitizeInput(formData.get('message'));
        
        // Enhanced validation
        if (!validateName(name)) {
            showNotification('Please provide a valid name (2-50 characters)', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please provide a valid email address', 'error');
            return;
        }
        
        if (!validateMessage(message)) {
            showNotification('Message must be between 10-1000 characters', 'error');
            return;
        }
        
        // Simulate form submission (in production, this would be a secure API call)
        console.log('Form submission validated:', { name, email, message });
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}

// Show notification - Kanye themed
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px 30px;
            background: #000;
            color: #fff;
            border: 2px solid #ff0000;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 3000;
            animation: slideIn 0.2s ease-out;
        }
        
        .notification.success {
            background: #000;
            border-color: #00ff00;
        }
        
        .notification.error {
            background: #000;
            border-color: #ff0000;
        }
        
        .notification.info {
            background: #000;
            border-color: #fff;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add hamburger animation
const style = document.createElement('style');
style.textContent = `
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);