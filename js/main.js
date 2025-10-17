// Main JavaScript functionality for JanDarpan

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// India Map City Interactions
function initializeMapInteractions() {
    const cityDots = document.querySelectorAll('.city-dot');
    
    // City information data
    const cityInfo = {
        'Delhi': {
            name: 'New Delhi',
            population: '32.9 Million',
            status: 'National Capital',
            issues: '156 reported this month',
            description: 'Capital territory with active citizen engagement'
        },
        'Mumbai': {
            name: 'Mumbai',
            population: '20.4 Million', 
            status: 'Financial Capital',
            issues: '234 reported this month',
            description: 'Major commercial hub with diverse governance challenges'
        },
        'Bangalore': {
            name: 'Bengaluru',
            population: '13.6 Million',
            status: 'IT Capital', 
            issues: '89 reported this month',
            description: 'Technology center with modern governance initiatives'
        },
        'Chennai': {
            name: 'Chennai',
            population: '11.5 Million',
            status: 'Industrial Hub',
            issues: '67 reported this month', 
            description: 'Major port city with active civic participation'
        },
        'Kolkata': {
            name: 'Kolkata',
            population: '15.7 Million',
            status: 'Cultural Capital',
            issues: '78 reported this month',
            description: 'Historical center with vibrant political discourse'
        },
        'Ahmedabad': {
            name: 'Ahmedabad', 
            population: '8.4 Million',
            status: 'Commercial Center',
            issues: '45 reported this month',
            description: 'Major textile and commercial hub'
        },
        'Lucknow': {
            name: 'Lucknow',
            population: '3.6 Million', 
            status: 'State Capital',
            issues: '34 reported this month',
            description: 'Administrative center of Uttar Pradesh'
        },
        'Hyderabad': {
            name: 'Hyderabad',
            population: '10.5 Million',
            status: 'Tech Hub',
            issues: '52 reported this month', 
            description: 'Emerging technology and pharmaceutical center'
        },
        'Jaipur': {
            name: 'Jaipur',
            population: '3.9 Million',
            status: 'Heritage City',
            issues: '28 reported this month',
            description: 'Historic capital with tourism governance focus'
        }
    };
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'city-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: linear-gradient(135deg, #FF9933, #FFFFFF, #138808);
        color: #2c3e50;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        font-size: 14px;
        line-height: 1.4;
        max-width: 250px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        border: 2px solid #fff;
        backdrop-filter: blur(10px);
    `;
    document.body.appendChild(tooltip);
    
    cityDots.forEach(dot => {
        const cityName = dot.getAttribute('data-city');
        const info = cityInfo[cityName];
        
        if (info) {
            dot.addEventListener('mouseenter', (e) => {
                tooltip.innerHTML = `
                    <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #138808;">
                        ${info.name}
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>Population:</strong> ${info.population}
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>Status:</strong> ${info.status}
                    </div>
                    <div style="margin-bottom: 5px; color: #FF9933;">
                        <strong>📊 ${info.issues}</strong>
                    </div>
                    <div style="font-style: italic; margin-top: 8px;">
                        ${info.description}
                    </div>
                `;
                
                const rect = dot.getBoundingClientRect();
                tooltip.style.left = rect.left + window.scrollX - 125 + 'px';
                tooltip.style.top = rect.top + window.scrollY - 160 + 'px';
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            });
            
            dot.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
            });
            
            // Click to navigate to issues page with city filter
            dot.addEventListener('click', () => {
                window.location.href = `issues.html?city=${encodeURIComponent(cityName)}`;
            });
        }
    });
}

// Initialize map interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMapInteractions);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter Animation for Statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger counter animation for stats section
            if (entry.target.classList.contains('stats-section')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.feature-card, .stats-section, .impact-section, .vision-section');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Performance Chart (using Chart.js if available)
function initializeChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    
    // Simple canvas drawing if Chart.js is not available
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw simple bar chart
    const data = [65, 78, 45, 89, 67, 56, 72];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const barWidth = width / data.length;
    const maxValue = Math.max(...data);
    
    ctx.fillStyle = '#FF9933';
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - 40);
        const x = index * barWidth + 10;
        const y = height - barHeight - 20;
        
        ctx.fillRect(x, y, barWidth - 20, barHeight);
        
        // Draw labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + (barWidth - 20) / 2, height - 5);
        ctx.fillText(value + '%', x + (barWidth - 20) / 2, y - 5);
        
        ctx.fillStyle = '#FF9933';
    });
}

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', initializeChart);

// City dots interaction
document.addEventListener('DOMContentLoaded', () => {
    const cityDots = document.querySelectorAll('.city-dot');
    
    cityDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('circle');
            ripple.setAttribute('cx', dot.getAttribute('cx'));
            ripple.setAttribute('cy', dot.getAttribute('cy'));
            ripple.setAttribute('r', '0');
            ripple.setAttribute('fill', 'none');
            ripple.setAttribute('stroke', '#FFD700');
            ripple.setAttribute('stroke-width', '2');
            ripple.style.opacity = '0.8';
            
            dot.parentNode.appendChild(ripple);
            
            // Animate ripple
            let radius = 0;
            const animate = () => {
                radius += 2;
                ripple.setAttribute('r', radius);
                ripple.style.opacity = 1 - (radius / 50);
                
                if (radius < 50) {
                    requestAnimationFrame(animate);
                } else {
                    ripple.remove();
                }
            };
            
            requestAnimationFrame(animate);
        });
    });
});

// Form validation and submission helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        backgroundColor: type === 'success' ? '#27ae60' : '#e74c3c',
        color: 'white',
        borderRadius: '5px',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .animate {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Search functionality (for future implementation)
function initializeSearch() {
    // This will be implemented when search functionality is added
    console.log('Search functionality initialized');
}

// Local storage helpers
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};

// User preferences
const UserPreferences = {
    theme: Storage.get('theme') || 'light',
    language: Storage.get('language') || 'en',
    
    setTheme: (theme) => {
        UserPreferences.theme = theme;
        Storage.set('theme', theme);
        document.body.setAttribute('data-theme', theme);
    },
    
    setLanguage: (language) => {
        UserPreferences.language = language;
        Storage.set('language', language);
        // Implement language switching logic
    }
};

// User Session Management
const UserSession = {
    isLoggedIn: () => {
        return localStorage.getItem('userType') !== null && localStorage.getItem('isLoggedIn') === 'true';
    },
    
    getUserData: () => {
        const userType = localStorage.getItem('userType');
        
        if (userType === 'politician') {
            return {
                name: localStorage.getItem('politicianName') || null,
                email: localStorage.getItem('politicianEmail') || null,
                id: localStorage.getItem('politicianId') || null,
                type: 'politician',
                position: localStorage.getItem('politicianPosition') || null,
                state: localStorage.getItem('politicianState') || null,
                constituency: localStorage.getItem('politicianConstituency') || null,
                party: localStorage.getItem('politicianParty') || null
            };
        } else if (userType === 'public') {
            return {
                name: localStorage.getItem('userName') || null,
                email: localStorage.getItem('userEmail') || null,
                type: 'public',
                state: localStorage.getItem('userState') || null,
                constituency: localStorage.getItem('userConstituency') || null
            };
        }
        
        return null;
    },
    
    logout: () => {
        // Clear all user data
        localStorage.clear();
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
};

// Profile Dropdown Functions
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (profileMenu && profileBtn) {
        profileMenu.classList.toggle('show');
        profileBtn.classList.toggle('active');
    }
}

// Close profile menu when clicking outside
document.addEventListener('click', (e) => {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (profileDropdown && !profileDropdown.contains(e.target)) {
        if (profileMenu) profileMenu.classList.remove('show');
        if (profileBtn) profileBtn.classList.remove('active');
    }
});

// Global logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        UserSession.logout();
    }
}

// Global edit profile function
function editProfile() {
    const userData = UserSession.getUserData();
    if (userData && userData.type === 'politician') {
        window.location.href = 'politician-dashboard.html';
    } else {
        window.location.href = 'citizen-dashboard.html';
    }
}

// Update Navigation based on user session
function updateNavigation() {
    const navAuth = document.getElementById('navAuth');
    const navProfile = document.getElementById('navProfile');
    const navUserName = document.getElementById('navUserName');
    
    if (UserSession.isLoggedIn()) {
        const userData = UserSession.getUserData();
        
        // Show profile section, hide auth section
        if (navAuth) navAuth.style.display = 'none';
        if (navProfile) navProfile.style.display = 'flex';
        
        // Update user name and dashboard links based on user type
        if (navUserName) {
            navUserName.textContent = userData.name || 'User';
        }
        
        // Update dashboard button link based on user type
        const citizenDashboardBtn = document.querySelector('.citizen-dashboard-btn');
        const profileMenuDashboardLink = document.querySelector('.profile-menu a[href*="dashboard"]');
        
        if (userData.type === 'politician') {
            // Update links for politician
            if (citizenDashboardBtn) {
                citizenDashboardBtn.href = 'politician-dashboard.html';
                citizenDashboardBtn.innerHTML = '<i class="fas fa-chart-line"></i> My Dashboard';
            }
            if (profileMenuDashboardLink) {
                profileMenuDashboardLink.href = 'politician-dashboard.html';
                profileMenuDashboardLink.innerHTML = '<i class="fas fa-chart-line"></i> My Dashboard';
            }
        } else {
            // Update links for citizen
            if (citizenDashboardBtn) {
                citizenDashboardBtn.href = 'citizen-dashboard.html';
                citizenDashboardBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> My Dashboard';
            }
            if (profileMenuDashboardLink) {
                profileMenuDashboardLink.href = 'citizen-dashboard.html';
                profileMenuDashboardLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> My Dashboard';
            }
        }
        
    } else {
        // Show auth section, hide profile section
        if (navAuth) navAuth.style.display = 'block';
        if (navProfile) navProfile.style.display = 'none';
    }
}

// Initialize user preferences and session
document.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute('data-theme', UserPreferences.theme);
    updateNavigation();
});

console.log('🇮🇳 JanDarpan - Democracy Accountability Platform Loaded Successfully! 🏛️');