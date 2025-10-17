// Dashboard Analytics JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize all charts
    initializeCharts();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize data export functionality
    initializeDataExport();
    
    // Initialize time filters
    initializeTimeFilters();
    
    // Initialize regional insights
    initializeRegionalInsights();
    
    // Initialize activity feed
    initializeActivityFeed();
}

// Charts initialization
function initializeCharts() {
    initializePerformanceTrendChart();
    initializeEngagementChart();
    initializePromiseChart();
    initializeRegionalPerformanceChart();
}

function initializePerformanceTrendChart() {
    const ctx = document.getElementById('performanceTrendChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Overall Performance',
                data: [72, 75, 78, 82, 85, 88, 86, 89, 91, 88, 92, 94],
                borderColor: '#FF9933',
                backgroundColor: 'rgba(255, 153, 51, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Citizen Satisfaction',
                data: [68, 71, 74, 79, 83, 86, 84, 87, 89, 86, 90, 92],
                borderColor: '#138808',
                backgroundColor: 'rgba(19, 136, 8, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Transparency Index',
                data: [65, 68, 72, 76, 80, 84, 82, 85, 87, 84, 88, 90],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function initializeEngagementChart() {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High Engagement', 'Medium Engagement', 'Low Engagement', 'No Response'],
            datasets: [{
                data: [35, 30, 25, 10],
                backgroundColor: ['#27ae60', '#f39c12', '#e74c3c', '#95a5a6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initializePromiseChart() {
    const ctx = document.getElementById('promiseChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Completed', 'In Progress', 'Delayed', 'Not Started'],
            datasets: [{
                label: 'Election Promises',
                data: [45, 30, 15, 10],
                backgroundColor: ['#27ae60', '#f39c12', '#e74c3c', '#95a5a6'],
                borderColor: ['#229954', '#d68910', '#cb4335', '#7f8c8d'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeRegionalPerformanceChart() {
    const ctx = document.getElementById('regionalChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['North', 'South', 'East', 'West', 'Central', 'Northeast'],
            datasets: [{
                label: 'Performance Score',
                data: [85, 92, 78, 88, 82, 75],
                borderColor: '#FF9933',
                backgroundColor: 'rgba(255, 153, 51, 0.2)',
                borderWidth: 2
            }, {
                label: 'Citizen Satisfaction',
                data: [82, 89, 75, 85, 80, 72],
                borderColor: '#138808',
                backgroundColor: 'rgba(19, 136, 8, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // Chart type toggles
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = btn.parentElement.querySelectorAll('.chart-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update chart based on selection
            updateChartView(btn.dataset.chart, btn.dataset.type);
        });
    });
    
    // Metric card interactions
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!card.classList.contains('primary')) {
                expandMetricCard(card);
            }
        });
    });
}

function updateChartView(chartId, viewType) {
    // This would update the specific chart based on the view type
    console.log(`Updating ${chartId} to ${viewType} view`);
}

function expandMetricCard(card) {
    // Create expanded view of metric card
    const modal = document.createElement('div');
    modal.className = 'metric-modal';
    modal.innerHTML = `
        <div class="metric-modal-content">
            <span class="metric-modal-close">&times;</span>
            <div class="metric-modal-header">
                ${card.querySelector('.metric-icon').outerHTML}
                <h3>${card.querySelector('h3').textContent}</h3>
            </div>
            <div class="metric-modal-body">
                <div class="metric-detail">
                    <div class="current-value">
                        ${card.querySelector('.metric-value').outerHTML}
                    </div>
                    <div class="trend-info">
                        ${card.querySelector('.metric-change').outerHTML}
                    </div>
                </div>
                <div class="metric-history">
                    <h4>Historical Trend</h4>
                    <canvas id="metricHistoryChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.metric-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Initialize trend chart
    initializeMetricHistoryChart();
}

function initializeMetricHistoryChart() {
    const ctx = document.getElementById('metricHistoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Trend',
                data: [65, 68, 72, 75, 78, 82],
                borderColor: '#FF9933',
                backgroundColor: 'rgba(255, 153, 51, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Data export functionality
function initializeDataExport() {
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboardData);
    }
}

function exportDashboardData() {
    // Mock data export
    const data = {
        exportDate: new Date().toISOString(),
        metrics: {
            totalPoliticians: 542,
            activePoliticians: 498,
            avgPerformance: 78.5,
            avgSatisfaction: 76.2,
            totalIssues: 1247,
            resolvedIssues: 892,
            transparencyIndex: 85.3,
            engagementRate: 72.8
        },
        trends: {
            performanceImprovement: '+8.5%',
            satisfactionImprovement: '+6.2%',
            issueResolutionImprovement: '+12.3%'
        }
    };
    
    // Convert to CSV format
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, 'jandarpan-dashboard-data.csv', 'text/csv');
}

function convertToCSV(data) {
    const headers = ['Metric', 'Value', 'Trend'];
    const rows = [
        ['Total Politicians', data.metrics.totalPoliticians, ''],
        ['Active Politicians', data.metrics.activePoliticians, ''],
        ['Average Performance', data.metrics.avgPerformance + '%', data.trends.performanceImprovement],
        ['Average Satisfaction', data.metrics.avgSatisfaction + '%', data.trends.satisfactionImprovement],
        ['Total Issues', data.metrics.totalIssues, ''],
        ['Resolved Issues', data.metrics.resolvedIssues, data.trends.issueResolutionImprovement],
        ['Transparency Index', data.metrics.transparencyIndex + '%', ''],
        ['Engagement Rate', data.metrics.engagementRate + '%', '']
    ];
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Time filters
function initializeTimeFilters() {
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', updateDashboardData);
    }
}

function updateDashboardData() {
    const selectedPeriod = document.querySelector('.time-filter').value;
    console.log(`Updating dashboard data for: ${selectedPeriod}`);
    
    // Show loading state
    showLoadingState();
    
    // Simulate data loading
    setTimeout(() => {
        hideLoadingState();
        // Update all metrics and charts based on selected period
        updateMetricsForPeriod(selectedPeriod);
    }, 1000);
}

function showLoadingState() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.opacity = '0.6';
    });
}

function hideLoadingState() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.opacity = '1';
    });
}

function updateMetricsForPeriod(period) {
    // Mock data updates based on period
    const periodData = {
        '7days': {
            politicians: 542,
            performance: 79.2,
            satisfaction: 77.8,
            transparency: 86.1
        },
        '30days': {
            politicians: 542,
            performance: 78.5,
            satisfaction: 76.2,
            transparency: 85.3
        },
        '90days': {
            politicians: 540,
            performance: 77.8,
            satisfaction: 75.5,
            transparency: 84.7
        },
        '1year': {
            politicians: 535,
            performance: 76.2,
            satisfaction: 73.8,
            transparency: 82.5
        }
    };
    
    const data = periodData[period] || periodData['30days'];
    
    // Update metric values with animation
    animateMetricUpdate('.active-politicians .number', data.politicians);
    animateMetricUpdate('.avg-performance .number', data.performance);
    animateMetricUpdate('.citizen-satisfaction .number', data.satisfaction);
    animateMetricUpdate('.transparency-index .number', data.transparency);
}

function animateMetricUpdate(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const currentValue = parseFloat(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = currentValue + (newValue - currentValue) * progress;
        element.textContent = typeof newValue === 'number' && newValue % 1 !== 0 
            ? value.toFixed(1) 
            : Math.floor(value);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Regional insights
function initializeRegionalInsights() {
    // Initialize India map interactions
    const stateRegions = document.querySelectorAll('.state-region');
    stateRegions.forEach(region => {
        region.addEventListener('click', function() {
            showStateDetails(this.dataset.state);
        });
        
        region.addEventListener('mouseenter', function() {
            showStateTooltip(this, this.dataset.state);
        });
        
        region.addEventListener('mouseleave', function() {
            hideStateTooltip();
        });
    });
}

function showStateDetails(stateName) {
    // Mock state data
    const stateData = {
        name: stateName,
        performance: Math.floor(Math.random() * 30) + 70,
        satisfaction: Math.floor(Math.random() * 25) + 65,
        issues: Math.floor(Math.random() * 100) + 50,
        politicians: Math.floor(Math.random() * 20) + 15
    };
    
    const modal = document.createElement('div');
    modal.className = 'state-modal';
    modal.innerHTML = `
        <div class="state-modal-content">
            <span class="state-modal-close">&times;</span>
            <h3>${stateData.name} Details</h3>
            <div class="state-metrics">
                <div class="state-metric">
                    <div class="metric-label">Performance Score</div>
                    <div class="metric-value">${stateData.performance}%</div>
                </div>
                <div class="state-metric">
                    <div class="metric-label">Citizen Satisfaction</div>
                    <div class="metric-value">${stateData.satisfaction}%</div>
                </div>
                <div class="state-metric">
                    <div class="metric-label">Active Issues</div>
                    <div class="metric-value">${stateData.issues}</div>
                </div>
                <div class="state-metric">
                    <div class="metric-label">Politicians</div>
                    <div class="metric-value">${stateData.politicians}</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.state-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showStateTooltip(element, stateName) {
    const tooltip = document.createElement('div');
    tooltip.className = 'state-tooltip';
    tooltip.textContent = stateName;
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideStateTooltip() {
    const tooltip = document.querySelector('.state-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Activity feed
function initializeActivityFeed() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreActivities);
    }
    
    // Auto-refresh activity feed every 30 seconds
    setInterval(refreshActivityFeed, 30000);
}

function loadMoreActivities() {
    const activityList = document.querySelector('.activity-list');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Show loading state
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Mock additional activities
    const newActivities = [
        {
            title: 'New Infrastructure Project Approved',
            description: 'A new road construction project has been approved for the Eastern district.',
            time: '15 minutes ago'
        },
        {
            title: 'Citizen Feedback Session Completed',
            description: 'Monthly feedback session with citizens concluded with valuable insights.',
            time: '32 minutes ago'
        },
        {
            title: 'Budget Allocation Updated',
            description: 'Budget for healthcare infrastructure has been increased by 15%.',
            time: '1 hour ago'
        }
    ];
    
    setTimeout(() => {
        newActivities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-header">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
                <div class="activity-description">${activity.description}</div>
            `;
            activityList.appendChild(activityItem);
        });
        
        loadMoreBtn.textContent = 'Load More Activities';
        loadMoreBtn.disabled = false;
    }, 1000);
}

function refreshActivityFeed() {
    // Simulate new activity
    const activityList = document.querySelector('.activity-list');
    const newActivity = document.createElement('div');
    newActivity.className = 'activity-item new-activity';
    newActivity.innerHTML = `
        <div class="activity-header">
            <div class="activity-title">Real-time Update</div>
            <div class="activity-time">Just now</div>
        </div>
        <div class="activity-description">Dashboard data refreshed with latest information.</div>
    `;
    
    activityList.insertBefore(newActivity, activityList.firstChild);
    
    // Remove new-activity class after animation
    setTimeout(() => {
        newActivity.classList.remove('new-activity');
    }, 3000);
}

// Load dashboard data
function loadDashboardData() {
    console.log('Loading dashboard data...');
    
    // Animate metric counters
    animateCounter('.active-politicians .number', 542);
    animateCounter('.avg-performance .number', 78.5);
    animateCounter('.citizen-satisfaction .number', 76.2);
    animateCounter('.transparency-index .number', 85.3);
    animateCounter('.total-issues .number', 1247);
    animateCounter('.resolved-issues .number', 892);
    animateCounter('.pending-issues .number', 355);
    animateCounter('.improvement-rate .number', 12.3);
}

// Counter animation
function animateCounter(selector, endValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const startValue = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        element.textContent = typeof endValue === 'number' && endValue % 1 !== 0 
            ? currentValue.toFixed(1) 
            : Math.floor(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Export functions for global access
window.exportDashboardData = exportDashboardData;
window.updateDashboardData = updateDashboardData;
window.loadMoreActivities = loadMoreActivities;