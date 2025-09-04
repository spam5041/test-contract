// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(12, 12, 12, 0.98)';
        } else {
            header.style.background = 'rgba(12, 12, 12, 0.95)';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and timeline items
    const animatedElements = document.querySelectorAll('.feature-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            
            // Format numbers with appropriate suffixes
            let displayValue = start;
            if (target >= 1000000) {
                displayValue = (start / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                displayValue = (start / 1000).toFixed(1) + 'K';
            } else {
                displayValue = Math.floor(start).toLocaleString();
            }
            
            element.textContent = element.textContent.includes('$') ? '$' + displayValue : displayValue;
        }, 16);
    }

    // Initialize counter animations when stats section is visible
    const statsSection = document.querySelector('.hero-stats');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValues = entry.target.querySelectorAll('.stat-value');
                statValues.forEach(stat => {
                    const text = stat.textContent;
                    let targetValue = 0;
                    
                    if (text.includes('$2.4M')) {
                        targetValue = 2.4;
                        stat.textContent = '$0M';
                        animateCounter(stat, targetValue);
                    } else if (text.includes('15,000+')) {
                        targetValue = 15000;
                        stat.textContent = '0';
                        animateCounter(stat, targetValue);
                    } else if (text.includes('$0.045')) {
                        targetValue = 0.045;
                        stat.textContent = '$0.000';
                        const timer = setInterval(() => {
                            let current = parseFloat(stat.textContent.replace('$', ''));
                            current += 0.001;
                            if (current >= targetValue) {
                                current = targetValue;
                                clearInterval(timer);
                            }
                            stat.textContent = '$' + current.toFixed(3);
                        }, 50);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Floating animation for hero card
    const floatingCard = document.querySelector('.floating-card');
    if (floatingCard) {
        let mouseX = 0;
        let mouseY = 0;
        let cardX = 0;
        let cardY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
        });

        function animateCard() {
            cardX += (mouseX - cardX) * 0.1;
            cardY += (mouseY - cardY) * 0.1;
            
            floatingCard.style.transform = `translate(${cardX}px, ${cardY}px)`;
            requestAnimationFrame(animateCard);
        }
        animateCard();
    }

    // Particle background effect
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '1';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(99, 102, 241, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();
});

// Wallet connection functionality
class SolanaWallet {
    constructor() {
        this.connected = false;
        this.publicKey = null;
        this.init();
    }

    init() {
        const connectButton = document.getElementById('connectWallet');
        if (connectButton) {
            connectButton.addEventListener('click', () => this.connectWallet());
        }
    }

    async connectWallet() {
        try {
            // Check if Phantom wallet is installed
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect();
                this.connected = true;
                this.publicKey = response.publicKey.toString();
                this.updateUI();
                this.showNotification('Кошелек успешно подключен!', 'success');
            } else {
                // Simulate wallet connection for demo
                this.simulateWalletConnection();
            }
        } catch (error) {
            console.error('Ошибка подключения кошелька:', error);
            this.showNotification('Ошибка подключения кошелька', 'error');
        }
    }

    simulateWalletConnection() {
        // Simulate wallet connection for demo purposes
        setTimeout(() => {
            this.connected = true;
            this.publicKey = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
            this.updateUI();
            this.showNotification('Демо кошелек подключен!', 'success');
        }, 1000);
    }

    updateUI() {
        const connectButton = document.getElementById('connectWallet');
        if (connectButton && this.connected) {
            connectButton.textContent = `${this.publicKey.slice(0, 4)}...${this.publicKey.slice(-4)}`;
            connectButton.style.background = 'rgba(16, 185, 129, 0.2)';
            connectButton.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '0.5rem';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'transform 0.3s ease';
        
        if (type === 'success') {
            notification.style.background = 'rgba(16, 185, 129, 0.9)';
        } else if (type === 'error') {
            notification.style.background = 'rgba(239, 68, 68, 0.9)';
        } else {
            notification.style.background = 'rgba(99, 102, 241, 0.9)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize wallet when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const wallet = new SolanaWallet();
});

// Price update simulation
function updateTokenPrice() {
    const priceElement = document.querySelector('.stat-value');
    if (priceElement && priceElement.textContent.includes('$')) {
        const currentPrice = 0.045;
        const variation = (Math.random() - 0.5) * 0.002; // ±0.001 variation
        const newPrice = Math.max(0.001, currentPrice + variation);
        
        // Update with a smooth transition
        const priceElements = document.querySelectorAll('.stat-value');
        priceElements.forEach(el => {
            if (el.textContent.includes('$0.045')) {
                el.style.transition = 'color 0.3s ease';
                el.textContent = '$' + newPrice.toFixed(3);
                
                // Color indication for price change
                if (variation > 0) {
                    el.style.color = '#10b981'; // green
                } else if (variation < 0) {
                    el.style.color = '#ef4444'; // red
                } else {
                    el.style.color = '#6366f1'; // blue
                }
                
                // Reset color after 1 second
                setTimeout(() => {
                    el.style.color = '#6366f1';
                }, 1000);
            }
        });
    }
}

// Update price every 5 seconds
setInterval(updateTokenPrice, 5000);

// Button interactions
document.addEventListener('DOMContentLoaded', function() {
    const buyButton = document.querySelector('.btn-primary');
    const whitepaperButton = document.querySelector('.btn-secondary');
    
    if (buyButton) {
        buyButton.addEventListener('click', function() {
            // Simulate buy action
            const notification = new Event('showNotification');
            notification.message = 'Функция покупки будет доступна после запуска!';
            notification.type = 'info';
            document.dispatchEvent(notification);
        });
    }
    
    if (whitepaperButton) {
        whitepaperButton.addEventListener('click', function() {
            // Simulate whitepaper download
            const notification = new Event('showNotification');
            notification.message = 'Whitepaper скоро будет доступен!';
            notification.type = 'info';
            document.dispatchEvent(notification);
        });
    }
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-open');
    }
}

// Add mobile menu styles if not present
if (window.innerWidth <= 768) {
    const style = document.createElement('style');
    style.textContent = `
        .nav-links.mobile-open {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(12, 12, 12, 0.98);
            flex-direction: column;
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
}
