// Citizen Dashboard JavaScript
class CitizenDashboard {
    constructor() {
        this.currentUser = this.getUserData();
        this.reports = [];
        this.constituency = {};
        this.activities = [];
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.loadUserReports();
        this.loadConstituencyInfo();
        this.loadRecentActivity();
        this.setupEventListeners();
    }

    getUserData() {
        // Get user data from localStorage (set during login)
        const userData = {
            name: localStorage.getItem('userName') || 'Demo Citizen',
            email: localStorage.getItem('userEmail') || 'demo@citizen.com',
            state: localStorage.getItem('userState') || 'Telangana',
            constituency: localStorage.getItem('userConstituency') || 'Hyderabad East',
            userType: localStorage.getItem('userType') || 'public'
        };
        return userData;
    }

    loadUserProfile() {
        // Update profile information
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('profileName').textContent = this.currentUser.name;
        document.getElementById('profileEmail').textContent = this.currentUser.email;
        document.getElementById('profileState').textContent = this.currentUser.state;
        document.getElementById('profileConstituency').textContent = this.currentUser.constituency;

        // Update edit form
        document.getElementById('editName').value = this.currentUser.name;
        document.getElementById('editEmail').value = this.currentUser.email;
        document.getElementById('editState').value = this.currentUser.state.toLowerCase().replace(/\s+/g, '-');
        document.getElementById('editConstituency').value = this.currentUser.constituency;
    }

    loadUserReports() {
        // Load user's reported issues from localStorage
        const userReports = JSON.parse(localStorage.getItem('userReports') || '[]');
        
        // Mock data for demonstration (you can remove this later)
        const mockReports = [
            {
                id: 'RPT001',
                title: 'Broken Street Light on MG Road',
                category: 'Infrastructure',
                status: 'resolved',
                date: '2024-10-10',
                priority: 'medium',
                description: 'Street light near MG Road junction has been broken for 2 weeks.',
                submittedDate: '2024-10-10'
            },
            {
                id: 'RPT002',
                title: 'Pothole on Jubilee Hills Road',
                category: 'Road Maintenance',
                status: 'in-progress',
                date: '2024-10-12',
                priority: 'high',
                description: 'Large pothole causing traffic issues and vehicle damage.',
                submittedDate: '2024-10-12'
            },
            {
                id: 'RPT003',
                title: 'Water Supply Interruption',
                category: 'Water Supply',
                status: 'pending',
                date: '2024-10-15',
                priority: 'high',
                description: 'No water supply in our area for the past 3 days.',
                submittedDate: '2024-10-15'
            },
            {
                id: 'RPT004',
                title: 'Garbage Collection Issue',
                category: 'Sanitation',
                status: 'resolved',
                date: '2024-10-08',
                priority: 'medium',
                description: 'Garbage not collected for over a week in Sector 12.',
                submittedDate: '2024-10-08'
            }
        ];

        // Combine user reports with mock data (real reports first)
        this.reports = [...userReports, ...mockReports];

        this.renderReports();
        this.updateReportsStats();
    }

    renderReports() {
        const reportsList = document.getElementById('reportsList');
        
        if (this.reports.length === 0) {
            reportsList.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-clipboard"></i>
                    <h3>No Reports Yet</h3>
                    <p>You haven't reported any issues yet. Start by reporting your first issue!</p>
                    <button class="btn-primary" onclick="createNewReport()">
                        <i class="fas fa-plus"></i> Report an Issue
                    </button>
                </div>
            `;
            return;
        }

        const reportsHTML = this.reports.slice(0, 5).map(report => {
            const statusClass = {
                'pending': 'status-pending',
                'in-progress': 'status-progress',
                'resolved': 'status-resolved'
            }[report.status];

            const priorityClass = {
                'low': 'priority-low',
                'medium': 'priority-medium',
                'high': 'priority-high'
            }[report.priority];

            return `
                <div class="report-item" onclick="viewReport('${report.id}')">
                    <div class="report-header">
                        <div class="report-id">#${report.id}</div>
                        <div class="report-status ${statusClass}">
                            <i class="fas ${this.getStatusIcon(report.status)}"></i>
                            ${this.formatStatus(report.status)}
                        </div>
                    </div>
                    <div class="report-content">
                        <h4>${report.title}</h4>
                        <p>${report.description}</p>
                        <div class="report-meta">
                            <span class="report-category">
                                <i class="fas fa-tag"></i>
                                ${report.category}
                            </span>
                            <span class="report-priority ${priorityClass}">
                                <i class="fas fa-flag"></i>
                                ${report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                            </span>
                            <span class="report-date">
                                <i class="fas fa-calendar"></i>
                                ${this.formatDate(report.submittedDate || report.date)}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        reportsList.innerHTML = reportsHTML;
    }

    updateReportsStats() {
        const totalReports = this.reports.length;
        const resolvedReports = this.reports.filter(r => r.status === 'resolved').length;
        const pendingReports = this.reports.filter(r => r.status === 'pending').length;
        const engagementScore = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

        document.getElementById('totalReports').textContent = totalReports;
        document.getElementById('resolvedReports').textContent = resolvedReports;
        document.getElementById('pendingReports').textContent = pendingReports;
        document.getElementById('citizenScore').textContent = `${engagementScore}%`;
    }

    loadConstituencyInfo() {
        // Load constituency information (mock data)
        this.constituency = {
            name: this.currentUser.constituency,
            state: this.currentUser.state,
            mp: 'Hon. Asaduddin Owaisi',
            mla: 'Hon. Ahmed Bin Abdullah Balala',
            population: '2,85,000',
            area: '45 sq km',
            developmentProjects: [
                {
                    name: 'Metro Rail Extension',
                    status: 'in-progress',
                    completion: '75%',
                    budget: '₹850 Crores'
                },
                {
                    name: 'Road Infrastructure Upgrade',
                    status: 'completed',
                    completion: '100%',
                    budget: '₹120 Crores'
                },
                {
                    name: 'Digital Library Project',
                    status: 'planning',
                    completion: '20%',
                    budget: '₹25 Crores'
                }
            ],
            recentUpdates: [
                {
                    date: '2024-10-15',
                    title: 'New Health Center Inaugurated',
                    description: 'A new primary health center has been opened in Sector 8.'
                },
                {
                    date: '2024-10-12',
                    title: 'Road Maintenance Work Completed',
                    description: 'Major road maintenance work on Jubilee Hills Road has been completed.'
                },
                {
                    date: '2024-10-08',
                    title: 'Water Supply Infrastructure Upgrade',
                    description: 'New water supply lines installed to improve water distribution.'
                }
            ]
        };

        this.renderConstituencyInfo();
    }

    renderConstituencyInfo() {
        const constituencyInfo = document.getElementById('constituencyInfo');
        
        const constituencyHTML = `
            <div class="constituency-card">
                <div class="constituency-header">
                    <h3>${this.constituency.name}</h3>
                    <p>${this.constituency.state}</p>
                </div>
                <div class="constituency-stats">
                    <div class="stat-item">
                        <span class="label">Population</span>
                        <span class="value">${this.constituency.population}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Area</span>
                        <span class="value">${this.constituency.area}</span>
                    </div>
                </div>
                <div class="representatives">
                    <h4><i class="fas fa-users"></i> Your Representatives</h4>
                    <div class="representative">
                        <span class="title">Member of Parliament (MP)</span>
                        <span class="name">${this.constituency.mp}</span>
                    </div>
                    <div class="representative">
                        <span class="title">Member of Legislative Assembly (MLA)</span>
                        <span class="name">${this.constituency.mla}</span>
                    </div>
                </div>
                <div class="development-projects">
                    <h4><i class="fas fa-hammer"></i> Development Projects</h4>
                    ${this.constituency.developmentProjects.map(project => `
                        <div class="project-item">
                            <div class="project-header">
                                <span class="project-name">${project.name}</span>
                                <span class="project-budget">${project.budget}</span>
                            </div>
                            <div class="project-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.completion}"></div>
                                </div>
                                <span class="progress-text">${project.completion}</span>
                            </div>
                            <div class="project-status status-${project.status.replace('-', '')}">${project.status.replace('-', ' ')}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="recent-updates">
                    <h4><i class="fas fa-bell"></i> Recent Updates</h4>
                    ${this.constituency.recentUpdates.slice(0, 3).map(update => `
                        <div class="update-item">
                            <div class="update-date">${this.formatDate(update.date)}</div>
                            <div class="update-content">
                                <h5>${update.title}</h5>
                                <p>${update.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        constituencyInfo.innerHTML = constituencyHTML;
    }

    loadRecentActivity() {
        // Load recent activity (mock data)
        this.activities = [
            {
                type: 'report',
                title: 'Reported Water Supply Issue',
                date: '2024-10-15T10:30:00',
                icon: 'fas fa-clipboard-list',
                description: 'You reported a water supply interruption in your area.'
            },
            {
                type: 'update',
                title: 'Issue Update: Pothole Repair In Progress',
                date: '2024-10-14T14:20:00',
                icon: 'fas fa-info-circle',
                description: 'Your reported pothole issue is now being addressed by the municipal corporation.'
            },
            {
                type: 'resolved',
                title: 'Issue Resolved: Street Light Fixed',
                date: '2024-10-13T16:45:00',
                icon: 'fas fa-check-circle',
                description: 'The broken street light you reported has been repaired.'
            },
            {
                type: 'scheme',
                title: 'Applied for PM Housing Scheme',
                date: '2024-10-12T09:15:00',
                icon: 'fas fa-home',
                description: 'You applied for the PM Awas Yojana housing scheme.'
            },
            {
                type: 'update',
                title: 'New Health Center Opened',
                date: '2024-10-11T11:30:00',
                icon: 'fas fa-hospital',
                description: 'A new primary health center has been inaugurated in your constituency.'
            }
        ];

        this.renderActivity();
    }

    renderActivity() {
        const activityTimeline = document.getElementById('activityTimeline');
        
        const activitiesHTML = this.activities.map(activity => {
            const timeAgo = this.getTimeAgo(activity.date);
            
            return `
                <div class="activity-item activity-${activity.type}">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            <h4>${activity.title}</h4>
                            <span class="activity-time">${timeAgo}</span>
                        </div>
                        <p>${activity.description}</p>
                    </div>
                </div>
            `;
        }).join('');

        activityTimeline.innerHTML = activitiesHTML;
    }

    setupEventListeners() {
        // Activity filter
        document.getElementById('activityFilter').addEventListener('change', (e) => {
            this.filterActivity(e.target.value);
        });

        // Edit profile form
        document.getElementById('editProfileForm').addEventListener('submit', (e) => {
            this.handleProfileUpdate(e);
        });

        // Auto-refresh reports every 30 seconds to catch new submissions
        setInterval(() => {
            this.refreshReports();
        }, 30000);
    }

    // Method to refresh reports without full page reload
    refreshReports() {
        this.loadUserReports();
    }

    filterActivity(filter) {
        let filteredActivities = this.activities;
        
        if (filter !== 'all') {
            filteredActivities = this.activities.filter(activity => {
                switch (filter) {
                    case 'reports':
                        return activity.type === 'report' || activity.type === 'resolved';
                    case 'updates':
                        return activity.type === 'update';
                    case 'schemes':
                        return activity.type === 'scheme';
                    default:
                        return true;
                }
            });
        }

        this.renderFilteredActivity(filteredActivities);
    }

    renderFilteredActivity(activities) {
        const activityTimeline = document.getElementById('activityTimeline');
        
        const activitiesHTML = activities.map(activity => {
            const timeAgo = this.getTimeAgo(activity.date);
            
            return `
                <div class="activity-item activity-${activity.type}">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            <h4>${activity.title}</h4>
                            <span class="activity-time">${timeAgo}</span>
                        </div>
                        <p>${activity.description}</p>
                    </div>
                </div>
            `;
        }).join('');

        activityTimeline.innerHTML = activitiesHTML || '<div class="no-data">No activities found for the selected filter.</div>';
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updatedData = {
            name: formData.get('name'),
            email: formData.get('email'),
            state: formData.get('state'),
            constituency: formData.get('constituency')
        };

        // Update localStorage
        localStorage.setItem('userName', updatedData.name);
        localStorage.setItem('userEmail', updatedData.email);
        localStorage.setItem('userState', updatedData.state);
        localStorage.setItem('userConstituency', updatedData.constituency);

        // Update current user data
        this.currentUser = { ...this.currentUser, ...updatedData };
        
        // Reload profile
        this.loadUserProfile();
        this.loadConstituencyInfo();
        
        // Close modal
        closeEditProfile();
        
        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
    }

    // Utility methods
    getStatusIcon(status) {
        const icons = {
            'pending': 'fa-clock',
            'in-progress': 'fa-spinner',
            'resolved': 'fa-check-circle'
        };
        return icons[status] || 'fa-question-circle';
    }

    formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Global functions
function initializeCitizenDashboard() {
    window.citizenDashboard = new CitizenDashboard();
}

function createNewReport() {
    window.location.href = 'issues.html';
}

function viewReport(reportId) {
    // Navigate to detailed report view
    console.log('Viewing report:', reportId);
    // This would typically navigate to a detailed report page
}

function viewFullConstituency() {
    // Navigate to constituency page
    window.location.href = 'map.html';
}

function editProfile() {
    document.getElementById('editProfileModal').style.display = 'flex';
}

function closeEditProfile() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function createNewReport() {
    // Navigate to issue reporting page
    window.location.href = 'issues.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}