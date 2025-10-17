// Manifesto Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const manifestoSearch = document.getElementById('manifestoSearch');
    const searchManifesto = document.getElementById('searchManifesto');
    const partyFilter = document.getElementById('partyFilter');
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const promiseTableBody = document.getElementById('promiseTableBody');
    const exportBtn = document.getElementById('exportData');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const promiseModal = document.getElementById('promiseModal');
    const closeModal = document.querySelector('.close');
    
    // Data
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredPromises = [];
    
    const promiseData = [
        {
            id: 1,
            promise: "Create 2 crore jobs annually",
            party: "BJP",
            category: "economy",
            timeline: "2019-2024",
            status: "in-progress",
            progress: 65,
            aiScore: 72,
            description: "Commitment to generate employment opportunities across various sectors including manufacturing, services, and agriculture.",
            details: {
                target: "2 crore jobs per year",
                achieved: "1.3 crore jobs created in 2023",
                methodology: "Based on CMIE employment data and government reports",
                challenges: "COVID-19 impact, automation, skill gaps",
                nextSteps: "Focus on skill development and startup ecosystem"
            }
        },
        {
            id: 2,
            promise: "Implement Ayushman Bharat for 50 crore people",
            party: "BJP",
            category: "healthcare",
            timeline: "2018-2023",
            status: "fulfilled",
            progress: 92,
            aiScore: 88,
            description: "Launch of world's largest healthcare scheme covering 50 crore beneficiaries with health insurance up to Rs 5 lakh.",
            details: {
                target: "50 crore beneficiaries",
                achieved: "47 crore enrolled, 4.7 crore treatments",
                methodology: "National Health Authority data",
                challenges: "Rural awareness, hospital infrastructure",
                nextSteps: "Expansion to include mental health and preventive care"
            }
        },
        {
            id: 3,
            promise: "Loan waiver for farmers",
            party: "Congress",
            category: "agriculture",
            timeline: "2018-2023",
            status: "delayed",
            progress: 45,
            aiScore: 56,
            description: "Promise to waive farm loans worth Rs 2 lakh crore to provide relief to distressed farmers.",
            details: {
                target: "Complete loan waiver within 10 days",
                achieved: "Partial waivers in some states",
                methodology: "State government announcements and implementations",
                challenges: "State finances, banking sector concerns",
                nextSteps: "Alternative support mechanisms being considered"
            }
        },
        {
            id: 4,
            promise: "Make Delhi pollution-free",
            party: "AAP",
            category: "environment",
            timeline: "2020-2025",
            status: "in-progress",
            progress: 58,
            aiScore: 64,
            description: "Comprehensive plan to reduce air pollution in Delhi through multiple interventions.",
            details: {
                target: "AQI below 100 consistently",
                achieved: "30% reduction in peak pollution days",
                methodology: "CPCB air quality monitoring data",
                challenges: "Regional pollution, stubble burning, vehicle emissions",
                nextSteps: "Electric bus fleet expansion, green building norms"
            }
        },
        {
            id: 5,
            promise: "Build 100 smart cities",
            party: "BJP",
            category: "infrastructure",
            timeline: "2015-2024",
            status: "fulfilled",
            progress: 87,
            aiScore: 82,
            description: "Development of 100 smart cities with modern infrastructure and digital governance.",
            details: {
                target: "100 smart cities with digital infrastructure",
                achieved: "98 cities selected, 85 projects completed",
                methodology: "Ministry of Housing and Urban Affairs progress reports",
                challenges: "Funding delays, technology integration",
                nextSteps: "Focus on sustainability and citizen services"
            }
        },
        {
            id: 6,
            promise: "Doubling farmers' income",
            party: "BJP",
            category: "agriculture",
            timeline: "2016-2022",
            status: "delayed",
            progress: 73,
            aiScore: 69,
            description: "Ambitious goal to double farmers' income through various agricultural reforms and support measures.",
            details: {
                target: "Double farmers' income by 2022",
                achieved: "68% increase in nominal terms",
                methodology: "Agricultural Statistics at a Glance, NSSO data",
                challenges: "Market volatility, climate change, input costs",
                nextSteps: "Focus on value addition and direct marketing"
            }
        },
        {
            id: 7,
            promise: "Free electricity for households",
            party: "AAP",
            category: "economy",
            timeline: "2020-2025",
            status: "fulfilled",
            progress: 95,
            aiScore: 91,
            description: "Provide free electricity up to 200 units for Delhi households.",
            details: {
                target: "Free electricity up to 200 units",
                achieved: "98% households receiving free electricity",
                methodology: "Delhi government electricity subsidy data",
                challenges: "Financial sustainability, grid infrastructure",
                nextSteps: "Renewable energy integration, efficiency programs"
            }
        },
        {
            id: 8,
            promise: "National Education Policy implementation",
            party: "BJP",
            category: "education",
            timeline: "2020-2025",
            status: "in-progress",
            progress: 42,
            aiScore: 58,
            description: "Comprehensive reform of education system from school to higher education level.",
            details: {
                target: "Complete NEP implementation across all states",
                achieved: "15 states have started implementation",
                methodology: "Ministry of Education progress reports",
                challenges: "State coordination, infrastructure, teacher training",
                nextSteps: "Accelerated teacher training and curriculum development"
            }
        },
        {
            id: 9,
            promise: "Metro expansion in major cities",
            party: "Congress",
            category: "infrastructure",
            timeline: "2019-2024",
            status: "in-progress",
            progress: 67,
            aiScore: 71,
            description: "Expand metro rail network in 20 major cities to improve urban transportation.",
            details: {
                target: "Metro in 20 major cities",
                achieved: "13 cities with operational metro, 7 under construction",
                methodology: "Ministry of Urban Development data",
                challenges: "Land acquisition, funding, technical expertise",
                nextSteps: "Focus on last-mile connectivity and feeder services"
            }
        },
        {
            id: 10,
            promise: "Universal basic income pilot",
            party: "Congress",
            category: "economy",
            timeline: "2019-2024",
            status: "broken",
            progress: 0,
            aiScore: 25,
            description: "Launch pilot program for universal basic income to support poorest households.",
            details: {
                target: "UBI pilot in 5 states covering 1 crore families",
                achieved: "No implementation",
                methodology: "Government announcements and budget allocations",
                challenges: "Political priority, fiscal constraints, administrative capacity",
                nextSteps: "Alternative social security measures being explored"
            }
        }
    ];
    
    // Initialize page
    function initializePage() {
        filteredPromises = [...promiseData];
        updateProgressCircle();
        renderPartyComparisonChart();
        renderPromiseTable();
        setupEventListeners();
    }
    
    // Update circular progress
    function updateProgressCircle() {
        const progressCircle = document.querySelector('.progress-circle[data-percentage]');
        if (progressCircle) {
            const percentage = progressCircle.getAttribute('data-percentage');
            const degrees = (percentage / 100) * 360;
            progressCircle.style.background = `conic-gradient(#FF9933 0deg, #FF9933 ${degrees}deg, #ecf0f1 ${degrees}deg)`;
        }
    }
    
    // Render party comparison chart
    function renderPartyComparisonChart() {
        const ctx = document.getElementById('partyComparisonChart');
        if (!ctx) return;
        
        const chartData = {
            labels: ['BJP', 'Congress', 'AAP', 'TMC', 'DMK'],
            datasets: [{
                label: 'Fulfillment Rate (%)',
                data: [72, 65, 78, 68, 75],
                backgroundColor: [
                    '#FF9933',
                    '#138808',
                    '#0080FF',
                    '#00AAFF',
                    '#FF6B35'
                ],
                borderColor: [
                    '#e67e22',
                    '#27ae60',
                    '#0066CC',
                    '#0088CC',
                    '#E55A2B'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Party Performance Comparison',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#2c3e50'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    // Filter promises
    function filterPromises() {
        const searchTerm = manifestoSearch.value.toLowerCase();
        const partyValue = partyFilter.value;
        const statusValue = statusFilter.value;
        const categoryValue = categoryFilter.value;
        
        filteredPromises = promiseData.filter(promise => {
            const matchesSearch = promise.promise.toLowerCase().includes(searchTerm) ||
                                promise.party.toLowerCase().includes(searchTerm) ||
                                promise.category.toLowerCase().includes(searchTerm);
            
            const matchesParty = partyValue === 'all' || promise.party.toLowerCase() === partyValue;
            const matchesStatus = statusValue === 'all' || promise.status === statusValue;
            const matchesCategory = categoryValue === 'all' || promise.category === categoryValue;
            
            return matchesSearch && matchesParty && matchesStatus && matchesCategory;
        });
        
        currentPage = 1;
        renderPromiseTable();
    }
    
    // Render promise table
    function renderPromiseTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pagePromises = filteredPromises.slice(startIndex, endIndex);
        
        promiseTableBody.innerHTML = pagePromises.map(promise => `
            <tr>
                <td>
                    <div class="promise-text">
                        ${promise.promise}
                        <small class="promise-desc">${promise.description.substring(0, 100)}...</small>
                    </div>
                </td>
                <td>
                    <span class="party-badge party-${promise.party.toLowerCase()}">${promise.party}</span>
                </td>
                <td>
                    <span class="category-tag">${capitalizeFirst(promise.category)}</span>
                </td>
                <td>${promise.timeline}</td>
                <td>
                    <span class="status-badge status-${promise.status}">${formatStatus(promise.status)}</span>
                </td>
                <td>
                    <div class="progress-mini">
                        <div class="fill" style="width: ${promise.progress}%"></div>
                    </div>
                    <small>${promise.progress}%</small>
                </td>
                <td>
                    <span class="ai-score ${getScoreClass(promise.aiScore)}">${promise.aiScore}/100</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" onclick="viewPromiseDetails(${promise.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        updatePagination();
        addTableRowAnimations();
    }
    
    // Add table row animations
    function addTableRowAnimations() {
        const rows = promiseTableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredPromises.length / itemsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // View promise details
    window.viewPromiseDetails = function(promiseId) {
        const promise = promiseData.find(p => p.id === promiseId);
        if (!promise) return;
        
        const modalBody = document.getElementById('promiseModalBody');
        modalBody.innerHTML = `
            <div class="promise-detail">
                <div class="detail-header">
                    <h3>${promise.promise}</h3>
                    <span class="status-badge status-${promise.status}">${formatStatus(promise.status)}</span>
                </div>
                
                <div class="detail-meta">
                    <div class="meta-item">
                        <span class="meta-label">Party:</span>
                        <span class="party-badge party-${promise.party.toLowerCase()}">${promise.party}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Category:</span>
                        <span class="category-tag">${capitalizeFirst(promise.category)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Timeline:</span>
                        <span>${promise.timeline}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">AI Analysis Score:</span>
                        <span class="ai-score ${getScoreClass(promise.aiScore)}">${promise.aiScore}/100</span>
                    </div>
                </div>
                
                <div class="detail-description">
                    <h4>Description</h4>
                    <p>${promise.description}</p>
                </div>
                
                <div class="detail-progress">
                    <h4>Progress Analysis</h4>
                    <div class="progress-section">
                        <div class="progress-bar-large">
                            <div class="progress-fill-large" style="width: ${promise.progress}%"></div>
                            <span class="progress-text">${promise.progress}% Complete</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-breakdown">
                    <h4>Detailed Analysis</h4>
                    <div class="breakdown-grid">
                        <div class="breakdown-item">
                            <strong>Target:</strong>
                            <p>${promise.details.target}</p>
                        </div>
                        <div class="breakdown-item">
                            <strong>Achieved:</strong>
                            <p>${promise.details.achieved}</p>
                        </div>
                        <div class="breakdown-item">
                            <strong>Methodology:</strong>
                            <p>${promise.details.methodology}</p>
                        </div>
                        <div class="breakdown-item">
                            <strong>Key Challenges:</strong>
                            <p>${promise.details.challenges}</p>
                        </div>
                        <div class="breakdown-item">
                            <strong>Next Steps:</strong>
                            <p>${promise.details.nextSteps}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        promiseModal.classList.add('active');
    };
    
    // Export data functionality
    function exportData() {
        const csvContent = [
            ['Promise', 'Party', 'Category', 'Timeline', 'Status', 'Progress', 'AI Score'],
            ...filteredPromises.map(p => [
                p.promise,
                p.party,
                p.category,
                p.timeline,
                p.status,
                p.progress + '%',
                p.aiScore
            ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'manifesto-tracker-data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search and filters
        manifestoSearch.addEventListener('input', filterPromises);
        searchManifesto.addEventListener('click', filterPromises);
        partyFilter.addEventListener('change', filterPromises);
        statusFilter.addEventListener('change', filterPromises);
        categoryFilter.addEventListener('change', filterPromises);
        
        // Pagination
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPromiseTable();
            }
        });
        
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPromises.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderPromiseTable();
            }
        });
        
        // Export
        exportBtn.addEventListener('click', exportData);
        
        // Modal
        closeModal.addEventListener('click', () => {
            promiseModal.classList.remove('active');
        });
        
        promiseModal.addEventListener('click', (e) => {
            if (e.target === promiseModal) {
                promiseModal.classList.remove('active');
            }
        });
        
        // Party card interactions
        const partyCards = document.querySelectorAll('.party-card');
        partyCards.forEach(card => {
            card.addEventListener('click', () => {
                const party = card.getAttribute('data-party');
                partyFilter.value = party;
                filterPromises();
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
        
        // Category card interactions
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                categoryFilter.value = category;
                filterPromises();
                document.querySelector('.promise-list').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Utility functions
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function formatStatus(status) {
        return status.split('-').map(word => capitalizeFirst(word)).join(' ');
    }
    
    function getScoreClass(score) {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-medium';
        return 'score-low';
    }
    
    // Add additional CSS for new elements
    const additionalStyles = `
        .promise-text {
            line-height: 1.4;
        }
        
        .promise-desc {
            display: block;
            color: #7f8c8d;
            font-size: 0.8rem;
            margin-top: 0.3rem;
        }
        
        .party-badge {
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .party-bjp { background: rgba(255, 153, 51, 0.2); color: #FF9933; }
        .party-congress { background: rgba(19, 136, 8, 0.2); color: #138808; }
        .party-aap { background: rgba(0, 128, 255, 0.2); color: #0080FF; }
        .party-tmc { background: rgba(0, 170, 255, 0.2); color: #00AAFF; }
        .party-dmk { background: rgba(255, 107, 53, 0.2); color: #FF6B35; }
        
        .category-tag {
            background: #ecf0f1;
            color: #2c3e50;
            padding: 0.2rem 0.6rem;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            gap: 1rem;
        }
        
        .detail-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }
        
        .meta-label {
            font-size: 0.8rem;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-description,
        .detail-progress,
        .detail-breakdown {
            margin-bottom: 2rem;
        }
        
        .detail-description h4,
        .detail-progress h4,
        .detail-breakdown h4 {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .progress-bar-large {
            width: 100%;
            height: 30px;
            background: #ecf0f1;
            border-radius: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill-large {
            height: 100%;
            background: linear-gradient(135deg, #FF9933, #e67e22);
            border-radius: 15px;
            transition: width 0.8s ease;
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #2c3e50;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        
        .breakdown-item {
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #FF9933;
        }
        
        .breakdown-item strong {
            color: #2c3e50;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .breakdown-item p {
            color: #7f8c8d;
            line-height: 1.5;
            margin: 0;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    // Initialize page
    initializePage();
    
    console.log('📊 Manifesto Tracker Loaded Successfully!');
});