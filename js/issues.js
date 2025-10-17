// Issues Reporting and Tracking JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeIssuesSystem();
});

function initializeIssuesSystem() {
    // Initialize form handling
    initializeReportForm();
    
    // Initialize tracking system
    initializeTracking();
    
    // Initialize charts
    initializeIssuesCharts();
    
    // Initialize filters and search
    initializeIssuesFilters();
    
    // Load issues data
    loadIssuesData();
    
    // Initialize file upload
    initializeFileUpload();
    
    // Initialize form steps
    initializeFormSteps();
}

// Report form handling
function initializeReportForm() {
    const form = document.getElementById('issueReportForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Initialize location detection
    const detectLocationBtn = document.getElementById('detectLocation');
    if (detectLocationBtn) {
        detectLocationBtn.addEventListener('click', detectLocation);
    }
    
    // Form validation
    const inputs = form?.querySelectorAll('input[required], textarea[required], select[required]');
    inputs?.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(e.target);
    const reportData = {
        id: generateTrackingId(),
        title: formData.get('title'),
        category: formData.get('category'),
        priority: formData.get('priority'),
        state: formData.get('state'),
        district: formData.get('district'),
        area: formData.get('area'),
        description: formData.get('description'),
        reporterName: formData.get('name') || 'Anonymous',
        reporterContact: formData.get('contact') || 'Not provided',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        submittedBy: localStorage.getItem('userName') || 'Anonymous',
        userEmail: localStorage.getItem('userEmail') || null
    };
    
    // Simulate form submission
    setTimeout(() => {
        // Save the report to user's reports
        saveReportToUserData(reportData);
        
        showSuccessMessage(reportData.id);
        resetForm();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
            if (localStorage.getItem('userType') === 'public') {
                window.location.href = 'citizen-dashboard.html';
            }
        }, 3000);
    }, 2000);
}

function validateForm() {
    let isValid = true;
    const form = document.getElementById('issueReportForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    let isValid = true;
    
    // Remove existing error
    clearFieldError({ target: field });
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    fieldGroup.appendChild(errorElement);
    field.classList.add('error');
}

function clearFieldError(e) {
    const field = e.target;
    const fieldGroup = field.closest('.form-group');
    const errorElement = fieldGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function generateTrackingId() {
    const prefix = 'JD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
}

function saveReportToUserData(reportData) {
    try {
        // Get existing user reports from localStorage
        const existingReports = JSON.parse(localStorage.getItem('userReports') || '[]');
        
        // Add the new report to the beginning of the array
        existingReports.unshift(reportData);
        
        // Keep only the last 50 reports to avoid storage issues
        if (existingReports.length > 50) {
            existingReports.splice(50);
        }
        
        // Save back to localStorage
        localStorage.setItem('userReports', JSON.stringify(existingReports));
        
        console.log('Report saved successfully:', reportData.id);
    } catch (error) {
        console.error('Error saving report to localStorage:', error);
    }
}

function showSuccessMessage(trackingId) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Issue Reported Successfully!</h3>
            <p>Your tracking ID is: <strong>${trackingId}</strong></p>
            <p>We'll send updates to your email address.</p>
            <p><small>Redirecting to your dashboard in 3 seconds...</small></p>
            <button onclick="this.parentElement.parentElement.remove()" class="close-success">Close</button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

function resetForm() {
    const form = document.getElementById('issueReportForm');
    form.reset();
    clearAllFileInputs();
}

// Location detection
function detectLocation() {
    const locationInput = document.getElementById('issueLocation');
    const detectBtn = document.getElementById('detectLocation');
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    detectBtn.textContent = 'Detecting...';
    detectBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // This would typically use a reverse geocoding service
            locationInput.value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
            
            detectBtn.textContent = 'Location Detected';
            setTimeout(() => {
                detectBtn.textContent = 'Detect Location';
                detectBtn.disabled = false;
            }, 2000);
        },
        function(error) {
            alert('Unable to retrieve your location. Please enter manually.');
            detectBtn.textContent = 'Detect Location';
            detectBtn.disabled = false;
        }
    );
}

// Tracking system
function initializeTracking() {
    const trackForm = document.getElementById('trackingForm');
    if (trackForm) {
        trackForm.addEventListener('submit', handleTrackingSubmission);
    }
}

function handleTrackingSubmission(e) {
    e.preventDefault();
    
    const trackingId = document.getElementById('trackingId').value.trim();
    if (!trackingId) {
        alert('Please enter a tracking ID');
        return;
    }
    
    // Mock tracking data
    const mockTrackingData = {
        id: trackingId,
        title: 'Road Repair Required',
        status: 'In Progress',
        submittedDate: '2024-01-15',
        lastUpdate: '2024-01-20',
        assignedTo: 'Municipal Corporation',
        description: 'Pothole repair needed on Main Street',
        updates: [
            { date: '2024-01-15', status: 'Submitted', description: 'Issue reported by citizen' },
            { date: '2024-01-16', status: 'Acknowledged', description: 'Issue acknowledged by authorities' },
            { date: '2024-01-18', status: 'In Progress', description: 'Repair work has begun' }
        ]
    };
    
    displayTrackingResults(mockTrackingData);
}

function displayTrackingResults(data) {
    const resultsDiv = document.getElementById('trackingResults');
    resultsDiv.style.display = 'block';
    
    resultsDiv.innerHTML = `
        <div class="tracking-card">
            <div class="tracking-header">
                <h3>${data.title}</h3>
                <span class="status-badge status-${data.status.toLowerCase().replace(' ', '-')}">${data.status}</span>
            </div>
            <div class="tracking-details">
                <div class="detail-item">
                    <strong>Tracking ID:</strong> ${data.id}
                </div>
                <div class="detail-item">
                    <strong>Submitted:</strong> ${data.submittedDate}
                </div>
                <div class="detail-item">
                    <strong>Last Update:</strong> ${data.lastUpdate}
                </div>
                <div class="detail-item">
                    <strong>Assigned To:</strong> ${data.assignedTo}
                </div>
                <div class="detail-item">
                    <strong>Description:</strong> ${data.description}
                </div>
            </div>
            <div class="tracking-timeline">
                <h4>Progress Timeline</h4>
                ${data.updates.map(update => `
                    <div class="timeline-item">
                        <div class="timeline-date">${update.date}</div>
                        <div class="timeline-content">
                            <strong>${update.status}</strong>
                            <p>${update.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Charts initialization
function initializeIssuesCharts() {
    initializeStatusChart();
    initializeCategoryChart();
    initializeTrendChart();
}

function initializeStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Resolved', 'In Progress', 'Pending', 'Rejected'],
            datasets: [{
                data: [45, 25, 20, 10],
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

function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Infrastructure', 'Sanitation', 'Traffic', 'Utilities', 'Safety', 'Environment'],
            datasets: [{
                label: 'Number of Issues',
                data: [120, 89, 67, 54, 43, 32],
                backgroundColor: '#FF9933',
                borderColor: '#e67e22',
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

function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Issues Reported',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#FF9933',
                backgroundColor: 'rgba(255, 153, 51, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Issues Resolved',
                data: [45, 49, 60, 71, 46, 45],
                borderColor: '#138808',
                backgroundColor: 'rgba(19, 136, 8, 0.1)',
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
                    position: 'top'
                }
            }
        }
    });
}

// Filters and search
function initializeIssuesFilters() {
    const searchInput = document.getElementById('issueSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterIssues);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterIssues);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterIssues);
    }
}

function filterIssues() {
    const searchTerm = document.getElementById('issueSearch')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('categoryFilter')?.value || '';
    const selectedStatus = document.getElementById('statusFilter')?.value || '';
    
    const issueCards = document.querySelectorAll('.issue-card');
    
    issueCards.forEach(card => {
        const title = card.querySelector('.issue-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.issue-description')?.textContent.toLowerCase() || '';
        const category = card.dataset.category?.toLowerCase() || '';
        const status = card.dataset.status?.toLowerCase() || '';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = !selectedCategory || category === selectedCategory.toLowerCase();
        const matchesStatus = !selectedStatus || status === selectedStatus.toLowerCase();
        
        if (matchesSearch && matchesCategory && matchesStatus) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// File upload handling
function initializeFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
}

function handleFileUpload(e) {
    const files = e.target.files;
    const preview = e.target.parentElement.querySelector('.file-preview') || createFilePreview(e.target.parentElement);
    
    preview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span class="file-name">${file.name}</span>
            <span class="file-size">(${formatFileSize(file.size)})</span>
            <button type="button" class="remove-file" onclick="removeFile(this)">×</button>
        `;
        preview.appendChild(fileItem);
    });
}

function createFilePreview(container) {
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    container.appendChild(preview);
    return preview;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(button) {
    button.parentElement.remove();
}

function clearAllFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.value = '';
        const preview = input.parentElement.querySelector('.file-preview');
        if (preview) {
            preview.innerHTML = '';
        }
    });
}

// Form steps handling
function initializeFormSteps() {
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', nextStep);
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
}

function nextStep(e) {
    const currentStep = e.target.closest('.form-step');
    const currentStepNum = parseInt(currentStep.dataset.step);
    const nextStepNum = currentStepNum + 1;
    const nextStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);
    
    if (validateCurrentStep(currentStep) && nextStep) {
        currentStep.style.display = 'none';
        nextStep.style.display = 'block';
        updateStepIndicator(nextStepNum);
    }
}

function prevStep(e) {
    const currentStep = e.target.closest('.form-step');
    const currentStepNum = parseInt(currentStep.dataset.step);
    const prevStepNum = currentStepNum - 1;
    const prevStep = document.querySelector(`.form-step[data-step="${prevStepNum}"]`);
    
    if (prevStep) {
        currentStep.style.display = 'none';
        prevStep.style.display = 'block';
        updateStepIndicator(prevStepNum);
    }
}

function validateCurrentStep(step) {
    const requiredFields = step.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function updateStepIndicator(stepNum) {
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
        if (index < stepNum) {
            indicator.classList.add('completed');
            indicator.classList.remove('active');
        } else if (index === stepNum - 1) {
            indicator.classList.add('active');
            indicator.classList.remove('completed');
        } else {
            indicator.classList.remove('active', 'completed');
        }
    });
}

// Load issues data
function loadIssuesData() {
    // Mock data loading
    console.log('Issues data loaded');
    
    // Update counters
    animateCounter('.total-issues .number', 1247);
    animateCounter('.resolved-issues .number', 892);
    animateCounter('.pending-issues .number', 243);
    animateCounter('.avg-resolution .number', 4.2);
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
window.filterIssues = filterIssues;
window.removeFile = removeFile;
window.handleTrackingSubmission = handleTrackingSubmission;