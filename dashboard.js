// ===== Dashboard JavaScript =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeSidebar();
    initializeNavigation();
    initializeCharts();
    initializeTables();
    initializeForms();
    initializeRealTimeUpdates();
});

// ===== Sidebar Functionality =====
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    sidebarToggle?.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // Load sidebar state from localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
}

// ===== Navigation Between Sections =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to current nav item
            this.parentElement.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update dashboard title
                const title = document.querySelector('.dashboard-title');
                if (title) {
                    title.textContent = this.querySelector('.nav-text').textContent;
                }
            }
        });
    });
}

// ===== Charts Initialization =====
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#00bfff',
                    backgroundColor: 'rgba(0, 191, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b8c5d1'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b8c5d1'
                        }
                    }
                }
            }
        });
    }
    
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Referral', 'Organic'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        '#00bfff',
                        '#7f00ff',
                        '#00ffff',
                        '#00ff88'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#b8c5d1'
                        }
                    }
                }
            }
        });
    }
    
    // Engagement Chart
    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
        new Chart(engagementCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Page Views',
                    data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
                    backgroundColor: 'rgba(0, 191, 255, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b8c5d1'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b8c5d1'
                        }
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'pie',
            data: {
                labels: ['Code Optimizer', 'UI Kit', 'Security Suite', 'API Gateway'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        '#00bfff',
                        '#7f00ff',
                        '#00ffff',
                        '#00ff88'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#b8c5d1'
                        }
                    }
                }
            }
        });
    }
}

// ===== Table Functionality =====
function initializeTables() {
    // Product table actions
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('title');
            const row = this.closest('tr');
            const productName = row.querySelector('.product-name')?.textContent;
            
            if (action === 'Delete') {
                if (confirm(`Are you sure you want to delete ${productName}?`)) {
                    row.remove();
                    showNotification(`${productName} deleted successfully`, 'success');
                }
            } else if (action === 'Edit') {
                showNotification(`Editing ${productName}`, 'info');
            }
        });
    });
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    addProductBtn?.addEventListener('click', function() {
        showNotification('Add product functionality coming soon!', 'info');
    });
}

// ===== Form Functionality =====
function initializeForms() {
    // Settings forms
    document.querySelectorAll('.settings-card form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showNotification('Settings saved successfully!', 'success');
            }, 1500);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Search through tables
        document.querySelectorAll('table tbody tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// ===== Real-time Updates =====
function initializeRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        // Update stats
        updateStats();
        
        // Update activity feed
        updateActivityFeed();
    }, 30000); // Update every 30 seconds
    
    // Initial update
    updateStats();
}

function updateStats() {
    // Simulate random stat changes
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/[$,]/g, ''));
        if (!isNaN(currentValue)) {
            const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
            const newValue = Math.max(0, currentValue + change);
            
            if (stat.textContent.includes('$')) {
                stat.textContent = `$${newValue.toLocaleString()}`;
            } else {
                stat.textContent = newValue.toLocaleString();
            }
        }
    });
}

function updateActivityFeed() {
    const activityFeed = document.querySelector('.activity-list');
    if (!activityFeed) return;
    
    const activities = [
        { icon: '🛒', text: 'New sale: Security Suite', time: 'Just now' },
        { icon: '👤', text: 'New user registration', time: '1 minute ago' },
        { icon: '⭐', text: 'New review: 5 stars', time: '3 minutes ago' },
        { icon: '💰', text: 'Payment received', time: '5 minutes ago' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-icon">${randomActivity.icon}</div>
        <div class="activity-content">
            <p>${randomActivity.text}</p>
            <span class="activity-time">${randomActivity.time}</span>
        </div>
    `;
    
    // Add new activity at the top
    activityFeed.insertBefore(activityItem, activityFeed.firstChild);
    
    // Remove oldest activity if more than 5
    const activities = activityFeed.querySelectorAll('.activity-item');
    if (activities.length > 5) {
        activities[activities.length - 1].remove();
    }
}

// ===== Notification System =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    if (type === 'success') {
        notification.style.background = 'rgba(0, 255, 136, 0.2)';
        notification.style.borderColor = 'rgba(0, 255, 136, 0.3)';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 71, 87, 0.2)';
        notification.style.borderColor = 'rgba(255, 71, 87, 0.3)';
    } else {
        notification.style.background = 'rgba(0, 191, 255, 0.2)';
        notification.style.borderColor = 'rgba(0, 191, 255, 0.3)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// ===== Mobile Menu Toggle =====
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ===== Logout Functionality =====
document.querySelector('.logout-btn')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});

// ===== Responsive Handling =====
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Ctrl + / to toggle sidebar
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('sidebar').classList.toggle('collapsed');
    }
    
    // Escape to close mobile sidebar
    if (e.key === 'Escape') {
        document.getElementById('sidebar').classList.remove('active');
    }
});

// ===== Loading Animation =====
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});