// Politician Dashboard JavaScript
class PoliticianDashboard {
    constructor() {
        this.politician = this.getPoliticianSession();
        this.reports = [];
        this.responses = [];
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        // Check if politician is logged in
        if (!this.politician) {
            window.location.href = 'politician-login.html';
            return;
        }

        this.loadPoliticianProfile();
        this.loadConstituencyReports();
        this.loadPerformanceData();
        this.loadResponses();
        this.setupEventListeners();
    }

    getPoliticianSession() {
        if (localStorage.getItem('userType') !== 'politician' || 
            localStorage.getItem('isLoggedIn') !== 'true') {
            return null;
        }
        
        return {
            name: localStorage.getItem('politicianName'),
            id: localStorage.getItem('politicianId'),
            email: localStorage.getItem('politicianEmail'),
            position: localStorage.getItem('politicianPosition'),
            state: localStorage.getItem('politicianState'),
            constituency: localStorage.getItem('politicianConstituency'),
            party: localStorage.getItem('politicianParty'),
            loginTime: localStorage.getItem('loginTime')
        };
    }

    loadPoliticianProfile() {
        document.getElementById('politicianName').textContent = this.politician.name;
        document.getElementById('politicianPosition').textContent = 
            this.formatPosition(this.politician.position);
        document.getElementById('politicianConstituency').textContent = 
            `${this.politician.constituency}, ${this.formatState(this.politician.state)}`;
        document.getElementById('politicianParty').textContent = 
            this.formatParty(this.politician.party);
        document.getElementById('politicianId').textContent = this.politician.id;
    }

    loadConstituencyReports() {
        // Get citizen reports from localStorage
        const allReports = JSON.parse(localStorage.getItem('userReports') || '[]');
        
        // Mock reports for the politician's constituency
        const mockReports = [
            {
                id: 'JD1729123456789',
                title: 'Broken Street Light on Main Road',
                category: 'Infrastructure',
                priority: 'medium',
                status: 'new',
                citizenName: 'Rajesh Kumar',
                citizenEmail: 'rajesh.kumar@email.com',
                location: {
                    state: this.politician.state,
                    district: 'Hyderabad',
                    area: 'Banjara Hills'
                },
                submittedDate: '2024-10-16',
                description: 'The street light near the main junction has been broken for a week. It poses safety risks during night hours.',
                urgency: 'medium'
            },
            {
                id: 'JD1729012345678',
                title: 'Water Supply Disruption',
                category: 'Water Supply',
                priority: 'high',
                status: 'acknowledged',
                citizenName: 'Priya Sharma',
                citizenEmail: 'priya.sharma@email.com',
                location: {
                    state: this.politician.state,
                    district: 'Hyderabad',
                    area: 'Jubilee Hills'
                },
                submittedDate: '2024-10-15',
                description: 'No water supply in our area for the past 3 days. Many residents are facing severe difficulties.',
                urgency: 'high'
            },
            {
                id: 'JD1728987654321',
                title: 'Pothole on Residential Street',
                category: 'Road Maintenance',
                priority: 'medium',
                status: 'in-progress',
                citizenName: 'Mohammad Ali',
                citizenEmail: 'mohammad.ali@email.com',
                location: {
                    state: this.politician.state,
                    district: 'Hyderabad',
                    area: 'Old City'
                },
                submittedDate: '2024-10-14',
                description: 'Large pothole causing traffic congestion and vehicle damage on residential street.',
                urgency: 'medium'
            },
            {
                id: 'JD1728876543210',
                title: 'Garbage Collection Delayed',
                category: 'Sanitation',
                priority: 'low',
                status: 'resolved',
                citizenName: 'Anita Reddy',
                citizenEmail: 'anita.reddy@email.com',
                location: {
                    state: this.politician.state,
                    district: 'Hyderabad',
                    area: 'Gachibowli'
                },
                submittedDate: '2024-10-12',
                description: 'Garbage collection has been delayed for over a week in our society.',
                urgency: 'low'
            }
        ];

        // Filter reports from politician's constituency and combine with real reports
        const constituencyReports = allReports.filter(report => 
            report.userConstituency === this.politician.constituency ||
            report.location?.constituency === this.politician.constituency
        );

        this.reports = [...constituencyReports, ...mockReports];
        
        this.renderReports();
        this.updateStats();
    }

    renderReports() {
        this.renderRecentReports();
        this.renderAllReports();
    }

    renderRecentReports() {
        const recentReportsList = document.getElementById('recentReportsList');
        const recentReports = this.reports.slice(0, 3);

        if (recentReports.length === 0) {
            recentReportsList.innerHTML = `
                <div class="no-reports">
                    <i class="fas fa-clipboard"></i>
                    <p>No recent reports from your constituency</p>
                </div>
            `;
            return;
        }

        recentReportsList.innerHTML = recentReports.map(report => `
            <div class="report-item" onclick="viewReport('${report.id}')">
                <div class="report-header">
                    <span class="report-id">#${report.id}</span>
                    <span class="report-status status-${report.status}">
                        ${this.formatStatus(report.status)}
                    </span>
                </div>
                <div class="report-title">${report.title}</div>
                <div class="report-meta">
                    <span><i class="fas fa-user"></i> ${report.citizenName || report.userName || 'Anonymous'}</span>
                    <span><i class="fas fa-tag"></i> ${report.category}</span>
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(report.submittedDate)}</span>
                </div>
            </div>
        `).join('');
    }

    renderAllReports() {
        const allReportsList = document.getElementById('allReportsList');
        
        if (this.reports.length === 0) {
            allReportsList.innerHTML = `
                <div class="no-reports">
                    <i class="fas fa-clipboard"></i>
                    <p>No reports found from your constituency</p>
                </div>
            `;
            return;
        }

        allReportsList.innerHTML = this.reports.map(report => `
            <div class="report-item" onclick="viewReport('${report.id}')">
                <div class="report-header">
                    <span class="report-id">#${report.id}</span>
                    <span class="report-status status-${report.status}">
                        ${this.formatStatus(report.status)}
                    </span>
                </div>
                <div class="report-title">${report.title}</div>
                <p style="margin: 10px 0; color: #666; font-size: 0.9rem;">
                    ${report.description?.substring(0, 120) || 'No description provided'}...
                </p>
                <div class="report-meta">
                    <span><i class="fas fa-user"></i> ${report.citizenName || report.userName || 'Anonymous'}</span>
                    <span><i class="fas fa-tag"></i> ${report.category}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${report.location?.area || report.area || 'Unknown'}</span>
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(report.submittedDate)}</span>
                    <span class="priority-${report.priority}">
                        <i class="fas fa-flag"></i> ${this.formatPriority(report.priority)}
                    </span>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="respondToReport('${report.id}', event)">
                        <i class="fas fa-reply"></i> Respond
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="updateStatus('${report.id}', event)">
                        <i class="fas fa-edit"></i> Update Status
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.reports.length;
        const pending = this.reports.filter(r => r.status === 'new' || r.status === 'acknowledged').length;
        const resolved = this.reports.filter(r => r.status === 'resolved').length;
        const responseRate = total > 0 ? Math.round(((resolved + this.reports.filter(r => r.status === 'in-progress').length) / total) * 100) : 0;

        document.getElementById('totalReports').textContent = total;
        document.getElementById('pendingReports').textContent = pending;
        document.getElementById('resolvedReports').textContent = resolved;
        document.getElementById('responseRate').textContent = `${responseRate}%`;
    }

    loadPerformanceData() {
        // Mock performance data
        const performanceData = {
            approvalRating: 85,
            avgResponseTime: 2.5,
            monthlyData: [
                { month: 'Apr', reports: 12, resolved: 10 },
                { month: 'May', reports: 18, resolved: 16 },
                { month: 'Jun', reports: 15, resolved: 14 },
                { month: 'Jul', reports: 22, resolved: 19 },
                { month: 'Aug', reports: 25, resolved: 23 },
                { month: 'Sep', reports: 20, resolved: 18 },
                { month: 'Oct', reports: this.reports.length, resolved: this.reports.filter(r => r.status === 'resolved').length }
            ]
        };

        document.getElementById('approvalRating').textContent = `${performanceData.approvalRating}%`;
        document.getElementById('avgResponseTime').textContent = performanceData.avgResponseTime;

        this.renderPerformanceChart(performanceData.monthlyData);
    }

    renderPerformanceChart(data) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.month),
                datasets: [{
                    label: 'Reports Received',
                    data: data.map(d => d.reports),
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Reports Resolved',
                    data: data.map(d => d.resolved),
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Performance Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    loadResponses() {
        // Mock response data
        this.responses = [
            {
                id: 'RESP001',
                reportId: 'JD1729012345678',
                reportTitle: 'Water Supply Disruption',
                response: 'Thank you for reporting this issue. I have contacted the water department and they will restore supply within 24 hours.',
                responseDate: '2024-10-16',
                status: 'acknowledged'
            }
        ];

        this.renderResponses();
    }

    renderResponses() {
        const responsesList = document.getElementById('responsesList');
        
        if (this.responses.length === 0) {
            responsesList.innerHTML = `
                <div class="no-reports">
                    <i class="fas fa-reply"></i>
                    <p>No responses sent yet</p>
                </div>
            `;
            return;
        }

        responsesList.innerHTML = this.responses.map(response => `
            <div class="report-item">
                <div class="report-header">
                    <span class="report-id">#${response.reportId}</span>
                    <span class="report-status status-${response.status}">
                        ${this.formatStatus(response.status)}
                    </span>
                </div>
                <div class="report-title">${response.reportTitle}</div>
                <p style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; font-style: italic;">
                    "${response.response}"
                </p>
                <div class="report-meta">
                    <span><i class="fas fa-calendar"></i> Responded on ${this.formatDate(response.responseDate)}</span>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Tab switching is handled by onclick in HTML
        
        // Add filters event listeners
        const statusFilter = document.getElementById('statusFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterReports());
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterReports());
        }
    }

    filterReports() {
        const statusFilter = document.getElementById('statusFilter').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        
        let filteredReports = [...this.reports];
        
        if (statusFilter !== 'all') {
            filteredReports = filteredReports.filter(report => report.status === statusFilter);
        }
        
        if (categoryFilter !== 'all') {
            filteredReports = filteredReports.filter(report => 
                report.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter
            );
        }
        
        // Temporarily store original reports and update with filtered
        const originalReports = this.reports;
        this.reports = filteredReports;
        this.renderAllReports();
        this.reports = originalReports; // Restore original
    }

    // Utility methods
    formatPosition(position) {
        const positions = {
            'mp': 'Member of Parliament',
            'mla': 'Member of Legislative Assembly',
            'councillor': 'Councillor',
            'sarpanch': 'Sarpanch',
            'mayor': 'Mayor'
        };
        return positions[position] || position;
    }

    formatState(state) {
        return state.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatParty(party) {
        const parties = {
            'bjp': 'BJP',
            'congress': 'INC',
            'aap': 'AAP',
            'bsp': 'BSP',
            'sp': 'SP',
            'tmc': 'TMC',
            'dmk': 'DMK',
            'aiadmk': 'AIADMK',
            'brs': 'BRS',
            'tdp': 'TDP',
            'jdu': 'JDU',
            'ss': 'Shiv Sena',
            'ncp': 'NCP',
            'independent': 'Independent'
        };
        return parties[party] || party.toUpperCase();
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatPriority(priority) {
        return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
}

// Global functions for HTML onclick events
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    // Add active class to selected nav tab
    event.target.classList.add('active');
}

function viewReport(reportId) {
    alert(`Viewing detailed report: ${reportId}\n\nThis would open a detailed view of the report with options to respond and update status.`);
    // In a real application, this would open a modal or navigate to a detailed view
}

function respondToReport(reportId, event) {
    event.stopPropagation();
    
    const response = prompt(`Respond to report #${reportId}:\n\nEnter your response to the citizen:`);
    
    if (response && response.trim()) {
        // In a real application, this would send the response to the server
        alert(`Response sent successfully!\n\nYour response: "${response}"\n\nThe citizen will be notified via email.`);
        
        // Update report status to acknowledged
        // This is a simplified implementation
        console.log(`Response sent for report ${reportId}: ${response}`);
    }
}

function updateStatus(reportId, event) {
    event.stopPropagation();
    
    const newStatus = prompt(`Update status for report #${reportId}:\n\nEnter new status (new, acknowledged, in-progress, resolved):`);
    
    if (newStatus && ['new', 'acknowledged', 'in-progress', 'resolved'].includes(newStatus)) {
        alert(`Status updated successfully!\n\nReport #${reportId} is now: ${newStatus}`);
        
        // In a real application, this would update the status on the server
        console.log(`Status updated for report ${reportId}: ${newStatus}`);
        
        // Refresh the page to show updated status
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else if (newStatus) {
        alert('Invalid status. Please use: new, acknowledged, in-progress, or resolved');
    }
}

function filterReports() {
    if (window.dashboard) {
        window.dashboard.filterReports();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'politician-login.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new PoliticianDashboard();
});

// Add additional CSS styles
const additionalStyles = `
    .no-reports {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }

    .no-reports i {
        font-size: 3rem;
        color: #ddd;
        margin-bottom: 15px;
    }

    .reports-filters {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
    }

    .reports-filters select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
    }

    .btn-sm {
        padding: 6px 12px;
        font-size: 0.8rem;
    }

    .priority-high { color: #dc3545; }
    .priority-medium { color: #ffc107; }
    .priority-low { color: #28a745; }

    .tab-content {
        animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Inject additional styles
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);