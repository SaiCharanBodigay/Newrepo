// Politicians Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePoliticiansDashboard();
});

function initializePoliticiansDashboard() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize performance chart
    initializePerformanceChart();
    
    // Initialize comparison chart
    initializeComparisonChart();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize modal functionality
    initializeModals();
    
    // Load politician data
    loadPoliticianData();
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('politicianSearch');
    const stateFilter = document.getElementById('stateFilter');
    const partyFilter = document.getElementById('partyFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterPoliticians);
    }
    
    if (stateFilter) {
        stateFilter.addEventListener('change', filterPoliticians);
    }
    
    if (partyFilter) {
        partyFilter.addEventListener('change', filterPoliticians);
    }
}

function filterPoliticians() {
    const searchTerm = document.getElementById('politicianSearch')?.value.toLowerCase() || '';
    const selectedState = document.getElementById('stateFilter')?.value || '';
    const selectedParty = document.getElementById('partyFilter')?.value || '';
    
    const politicianCards = document.querySelectorAll('.politician-card');
    
    politicianCards.forEach(card => {
        const name = card.querySelector('.politician-name')?.textContent.toLowerCase() || '';
        const constituency = card.querySelector('.politician-constituency')?.textContent.toLowerCase() || '';
        const party = card.querySelector('.politician-party')?.textContent.toLowerCase() || '';
        const state = card.dataset.state?.toLowerCase() || '';
        
        const matchesSearch = name.includes(searchTerm) || constituency.includes(searchTerm);
        const matchesState = !selectedState || state === selectedState.toLowerCase();
        const matchesParty = !selectedParty || party.includes(selectedParty.toLowerCase());
        
        if (matchesSearch && matchesState && matchesParty) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Performance chart initialization
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Overall Performance',
                data: [72, 75, 78, 82, 85, 88],
                borderColor: '#FF9933',
                backgroundColor: 'rgba(255, 153, 51, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Promise Fulfillment',
                data: [68, 71, 74, 79, 83, 86],
                borderColor: '#138808',
                backgroundColor: 'rgba(19, 136, 8, 0.1)',
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

// Comparison chart initialization
function initializeComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Attendance', 'Bills Passed', 'Debates', 'Committees', 'Public Engagement', 'Transparency'],
            datasets: [{
                label: 'Top Performer',
                data: [95, 88, 92, 85, 90, 87],
                borderColor: '#FF9933',
                backgroundColor: 'rgba(255, 153, 51, 0.2)',
                borderWidth: 2
            }, {
                label: 'Average',
                data: [75, 68, 72, 65, 70, 67],
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

// Filter functionality
function initializeFilters() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortPoliticians);
    }
}

function sortPoliticians() {
    const sortBy = document.getElementById('sortBy')?.value || 'score';
    const grid = document.querySelector('.politicians-grid');
    const cards = Array.from(document.querySelectorAll('.politician-card'));
    
    cards.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'score':
                valueA = parseFloat(a.querySelector('.score-number')?.textContent || '0');
                valueB = parseFloat(b.querySelector('.score-number')?.textContent || '0');
                return valueB - valueA; // Descending
            case 'name':
                valueA = a.querySelector('.politician-name')?.textContent || '';
                valueB = b.querySelector('.politician-name')?.textContent || '';
                return valueA.localeCompare(valueB);
            case 'constituency':
                valueA = a.querySelector('.politician-constituency')?.textContent || '';
                valueB = b.querySelector('.politician-constituency')?.textContent || '';
                return valueA.localeCompare(valueB);
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));
}

// Modal functionality
function initializeModals() {
    const modal = document.getElementById('politicianModal');
    const closeBtn = modal?.querySelector('.close');
    
    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', closePoliticianModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePoliticianModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePoliticianModal();
        }
    });
    
    // Add click events to politician cards
    document.querySelectorAll('.politician-card').forEach(card => {
        card.addEventListener('click', function() {
            const politicianData = extractPoliticianData(card);
            showPoliticianModal(politicianData);
        });
    });
}

function extractPoliticianData(card) {
    return {
        name: card.querySelector('.politician-name')?.textContent || '',
        party: card.querySelector('.politician-party')?.textContent || '',
        constituency: card.querySelector('.politician-constituency')?.textContent || '',
        score: card.querySelector('.score-number')?.textContent || '0',
        image: card.querySelector('.politician-image')?.src || '/images/default-politician.jpg',
        attendance: Math.floor(Math.random() * 30) + 70,
        bills: Math.floor(Math.random() * 20) + 10,
        debates: Math.floor(Math.random() * 15) + 5,
        committees: Math.floor(Math.random() * 8) + 2,
        engagement: Math.floor(Math.random() * 25) + 15,
        transparency: Math.floor(Math.random() * 20) + 70
    };
}

function showPoliticianModal(data) {
    const modal = document.getElementById('politicianModal');
    if (!modal) return;
    
    // Update modal content
    modal.querySelector('.modal-politician-name').textContent = data.name;
    modal.querySelector('.modal-politician-party').textContent = data.party;
    modal.querySelector('.modal-politician-constituency').textContent = data.constituency;
    modal.querySelector('.modal-politician-score').textContent = data.score;
    modal.querySelector('.modal-politician-image').src = data.image;
    
    // Update metrics
    updateModalMetric('attendance', data.attendance);
    updateModalMetric('bills', data.bills);
    updateModalMetric('debates', data.debates);
    updateModalMetric('committees', data.committees);
    updateModalMetric('engagement', data.engagement);
    updateModalMetric('transparency', data.transparency);
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function updateModalMetric(type, value) {
    const element = document.querySelector(`.modal-${type} .metric-value`);
    if (element) {
        element.textContent = value + (type === 'attendance' || type === 'transparency' ? '%' : '');
    }
}

function closePoliticianModal() {
    const modal = document.getElementById('politicianModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Load politician data (mock data)
function loadPoliticianData() {
    // This would typically fetch from an API
    console.log('Politician data loaded');
    
    // Update counters with animation
    animateCounter('.total-politicians .number', 542);
    animateCounter('.active-politicians .number', 498);
    animateCounter('.avg-score .number', 76.8);
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
window.filterPoliticians = filterPoliticians;
window.sortPoliticians = sortPoliticians;
window.showPoliticianModal = showPoliticianModal;
window.closePoliticianModal = closePoliticianModal;