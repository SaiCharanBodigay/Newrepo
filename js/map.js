// Map Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Map elements
    const statePaths = document.querySelectorAll('.state-path');
    const tooltip = document.getElementById('stateTooltip');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipScore = document.getElementById('tooltipScore');
    const tooltipPopulation = document.getElementById('tooltipPopulation');
    const tooltipMLAs = document.getElementById('tooltipMLAs');
    
    // Control elements
    const mapView = document.getElementById('mapView');
    const dataMetric = document.getElementById('dataMetric');
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeModal = document.querySelector('.close');
    const locationSearch = document.getElementById('locationSearch');
    const searchLocation = document.getElementById('searchLocation');
    const searchResults = document.getElementById('searchResults');
    
    // Tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // State data
    const stateData = {
        'Maharashtra': {
            score: 78,
            population: '112.4M',
            mlas: 288,
            capital: 'Mumbai',
            issues: ['Infrastructure', 'Water Management', 'Employment'],
            politicians: [
                { name: 'Uddhav Thackeray', position: 'Chief Minister', party: 'Shiv Sena (UBT)', score: 75 },
                { name: 'Devendra Fadnavis', position: 'Deputy CM', party: 'BJP', score: 82 },
                { name: 'Ajit Pawar', position: 'Deputy CM', party: 'NCP', score: 70 }
            ]
        },
        'Karnataka': {
            score: 82,
            population: '61.1M',
            mlas: 224,
            capital: 'Bengaluru',
            issues: ['Traffic Congestion', 'Power Supply', 'Agriculture'],
            politicians: [
                { name: 'Siddaramaiah', position: 'Chief Minister', party: 'Congress', score: 85 },
                { name: 'D.K. Shivakumar', position: 'Deputy CM', party: 'Congress', score: 80 },
                { name: 'B.S. Yediyurappa', position: 'Former CM', party: 'BJP', score: 78 }
            ]
        },
        'Tamil Nadu': {
            score: 85,
            population: '72.1M',
            mlas: 234,
            capital: 'Chennai',
            issues: ['Education', 'Healthcare', 'Industrial Development'],
            politicians: [
                { name: 'M.K. Stalin', position: 'Chief Minister', party: 'DMK', score: 88 },
                { name: 'O. Panneerselvam', position: 'Former CM', party: 'AIADMK', score: 72 },
                { name: 'Edappadi K. Palaniswami', position: 'Opposition Leader', party: 'AIADMK', score: 75 }
            ]
        },
        'Gujarat': {
            score: 75,
            population: '60.4M',
            mlas: 182,
            capital: 'Gandhinagar',
            issues: ['Environment', 'Social Development', 'Tourism'],
            politicians: [
                { name: 'Bhupendra Patel', position: 'Chief Minister', party: 'BJP', score: 78 },
                { name: 'Nitin Patel', position: 'Deputy CM', party: 'BJP', score: 73 },
                { name: 'Hardik Patel', position: 'Congress Leader', party: 'Congress', score: 68 }
            ]
        },
        'Rajasthan': {
            score: 65,
            population: '68.5M',
            mlas: 200,
            capital: 'Jaipur',
            issues: ['Water Scarcity', 'Rural Development', 'Education'],
            politicians: [
                { name: 'Ashok Gehlot', position: 'Chief Minister', party: 'Congress', score: 70 },
                { name: 'Sachin Pilot', position: 'Former Deputy CM', party: 'Congress', score: 72 },
                { name: 'Vasundhara Raje', position: 'Former CM', party: 'BJP', score: 68 }
            ]
        },
        'Uttar Pradesh': {
            score: 45,
            population: '199.8M',
            mlas: 403,
            capital: 'Lucknow',
            issues: ['Law & Order', 'Infrastructure', 'Employment'],
            politicians: [
                { name: 'Yogi Adityanath', position: 'Chief Minister', party: 'BJP', score: 48 },
                { name: 'Akhilesh Yadav', position: 'SP President', party: 'SP', score: 52 },
                { name: 'Mayawati', position: 'BSP Chief', party: 'BSP', score: 45 }
            ]
        },
        'West Bengal': {
            score: 70,
            population: '91.3M',
            mlas: 294,
            capital: 'Kolkata',
            issues: ['Industrial Development', 'Political Violence', 'Migration'],
            politicians: [
                { name: 'Mamata Banerjee', position: 'Chief Minister', party: 'TMC', score: 75 },
                { name: 'Suvendu Adhikari', position: 'Opposition Leader', party: 'BJP', score: 65 },
                { name: 'Abhishek Banerjee', position: 'TMC Leader', party: 'TMC', score: 72 }
            ]
        },
        'Delhi': {
            score: 88,
            population: '32.9M',
            mlas: 70,
            capital: 'New Delhi',
            issues: ['Air Pollution', 'Traffic', 'Housing'],
            politicians: [
                { name: 'Arvind Kejriwal', position: 'Chief Minister', party: 'AAP', score: 90 },
                { name: 'Manish Sisodia', position: 'Deputy CM', party: 'AAP', score: 88 },
                { name: 'Atishi Marlena', position: 'Education Minister', party: 'AAP', score: 92 }
            ]
        }
    };
    
    // Color mapping based on scores
    function getColorByScore(score) {
        if (score >= 80) return '#27ae60';
        if (score >= 60) return '#f39c12';
        if (score >= 40) return '#e67e22';
        return '#e74c3c';
    }
    
    // Update map colors based on current metric
    function updateMapColors() {
        statePaths.forEach(path => {
            const stateName = path.getAttribute('data-state');
            const data = stateData[stateName];
            if (data) {
                const color = getColorByScore(data.score);
                path.setAttribute('fill', color);
            }
        });
    }
    
    // Show tooltip
    function showTooltip(event, stateName) {
        const data = stateData[stateName];
        if (!data) return;
        
        tooltipTitle.textContent = stateName;
        tooltipScore.textContent = data.score + '%';
        tooltipPopulation.textContent = data.population;
        tooltipMLAs.textContent = data.mlas;
        
        tooltip.classList.add('visible');
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        const mapRect = document.querySelector('.map-wrapper').getBoundingClientRect();
        
        let left = event.clientX - mapRect.left + 10;
        let top = event.clientY - mapRect.top - 10;
        
        // Ensure tooltip stays within bounds
        if (left + tooltip.offsetWidth > mapRect.width) {
            left = event.clientX - mapRect.left - tooltip.offsetWidth - 10;
        }
        if (top < 0) {
            top = event.clientY - mapRect.top + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
    
    // Hide tooltip
    function hideTooltip() {
        tooltip.classList.remove('visible');
    }
    
    // Update details panel
    function updateDetailsPanel(stateName) {
        const data = stateData[stateName];
        if (!data) return;
        
        // Update overview tab
        const overviewTab = document.getElementById('overview');
        overviewTab.innerHTML = `
            <div class="state-overview">
                <h4>${stateName}</h4>
                <div class="state-stats">
                    <div class="stat-grid">
                        <div class="stat-item">
                            <span class="stat-label">Accountability Score</span>
                            <span class="stat-value" style="color: ${getColorByScore(data.score)}">${data.score}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Population</span>
                            <span class="stat-value">${data.population}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">MLAs</span>
                            <span class="stat-value">${data.mlas}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Capital</span>
                            <span class="stat-value">${data.capital}</span>
                        </div>
                    </div>
                </div>
                
                <div class="key-issues">
                    <h5>Key Issues</h5>
                    <div class="issues-tags">
                        ${data.issues.map(issue => `<span class="issue-tag">${issue}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Update politicians tab
        const politiciansTab = document.getElementById('politicians');
        politiciansTab.innerHTML = `
            <div class="politicians-list">
                <h4>Political Representatives</h4>
                <div class="politicians-grid">
                    ${data.politicians.map(politician => `
                        <div class="politician-card">
                            <div class="politician-info">
                                <h5>${politician.name}</h5>
                                <p class="position">${politician.position}</p>
                                <p class="party">${politician.party}</p>
                            </div>
                            <div class="politician-score">
                                <span class="score" style="color: ${getColorByScore(politician.score)}">${politician.score}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Update issues tab
        const issuesTab = document.getElementById('issues');
        issuesTab.innerHTML = `
            <div class="issues-list">
                <h4>Citizen Issues</h4>
                <div class="issues-summary">
                    <p>Major concerns reported by citizens in ${stateName}:</p>
                    <ul class="issues-detail">
                        ${data.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                </div>
                <button class="report-issue-btn" onclick="window.location.href='issues.html'">
                    <i class="fas fa-plus"></i> Report New Issue
                </button>
            </div>
        `;
    }
    
    // Event listeners for state paths
    statePaths.forEach(path => {
        path.addEventListener('mouseenter', (e) => {
            const stateName = e.target.getAttribute('data-state');
            showTooltip(e, stateName);
        });
        
        path.addEventListener('mousemove', (e) => {
            const stateName = e.target.getAttribute('data-state');
            showTooltip(e, stateName);
        });
        
        path.addEventListener('mouseleave', hideTooltip);
        
        path.addEventListener('click', (e) => {
            const stateName = e.target.getAttribute('data-state');
            updateDetailsPanel(stateName);
            
            // Highlight selected state
            statePaths.forEach(p => p.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });
    
    // Control event listeners
    mapView.addEventListener('change', (e) => {
        console.log('Map view changed to:', e.target.value);
        // Implement view change logic
    });
    
    dataMetric.addEventListener('change', (e) => {
        console.log('Data metric changed to:', e.target.value);
        updateMapColors(); // Update colors based on new metric
    });
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        locationSearch.focus();
    });
    
    closeModal.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
        }
    });
    
    // Search functionality
    function performSearch(query) {
        const results = [];
        Object.keys(stateData).forEach(state => {
            if (state.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    name: state,
                    type: 'State',
                    score: stateData[state].score
                });
            }
        });
        
        displaySearchResults(results);
    }
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No results found</p>';
            return;
        }
        
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="selectSearchResult('${result.name}')">
                <div class="result-info">
                    <span class="result-name">${result.name}</span>
                    <span class="result-type">${result.type}</span>
                </div>
                <span class="result-score" style="color: ${getColorByScore(result.score)}">${result.score}%</span>
            </div>
        `).join('');
    }
    
    // Global function for search result selection
    window.selectSearchResult = function(stateName) {
        // Find and click the state
        const statePath = document.querySelector(`[data-state="${stateName}"]`);
        if (statePath) {
            statePath.click();
            // Zoom to state (simulate by highlighting)
            statePath.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        searchModal.classList.remove('active');
    };
    
    locationSearch.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            performSearch(query);
        } else {
            searchResults.innerHTML = '';
        }
    });
    
    searchLocation.addEventListener('click', () => {
        const query = locationSearch.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    // Tab functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Initialize map
    updateMapColors();
    
    // Add CSS for additional styling
    const additionalStyles = `
        .state-path.selected {
            stroke: #2c3e50 !important;
            stroke-width: 4 !important;
            filter: brightness(1.2) !important;
        }
        
        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .stat-item {
            display: flex;
            flex-direction: column;
            padding: 0.8rem;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-bottom: 0.3rem;
        }
        
        .stat-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .key-issues {
            margin-top: 1.5rem;
        }
        
        .key-issues h5 {
            color: #2c3e50;
            margin-bottom: 0.8rem;
        }
        
        .issues-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .issue-tag {
            background: linear-gradient(135deg, #FF9933, #e67e22);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .politicians-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .politician-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .politician-card:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .politician-info h5 {
            color: #2c3e50;
            margin-bottom: 0.3rem;
        }
        
        .position {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 0.2rem;
        }
        
        .party {
            color: #FF9933;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .politician-score .score {
            font-size: 1.2rem;
            font-weight: 700;
        }
        
        .issues-detail {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        
        .issues-detail li {
            margin-bottom: 0.5rem;
            color: #7f8c8d;
        }
        
        .report-issue-btn {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .report-issue-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        }
        
        .search-result-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem;
            border-bottom: 1px solid #ecf0f1;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .search-result-item:hover {
            background: #f8f9fa;
        }
        
        .result-info {
            display: flex;
            flex-direction: column;
        }
        
        .result-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .result-type {
            font-size: 0.8rem;
            color: #7f8c8d;
        }
        
        .result-score {
            font-weight: 700;
            font-size: 1.1rem;
        }
        
        .no-results {
            text-align: center;
            color: #7f8c8d;
            padding: 2rem;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    console.log('🗺️ Interactive Map Loaded Successfully!');
});