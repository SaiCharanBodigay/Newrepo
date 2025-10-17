// Politician Authentication JavaScript
class PoliticianAuth {
    constructor() {
        this.form = document.getElementById('politicianLoginForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Setup dynamic constituency loading based on state
        const stateSelect = document.getElementById('state');
        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => this.updateConstituencies(e.target.value));
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const loginData = {
            fullName: formData.get('fullName'),
            politicianId: formData.get('politicianId'),
            email: formData.get('email'),
            password: formData.get('password'),
            position: formData.get('position'),
            state: formData.get('state'),
            constituency: formData.get('constituency'),
            party: formData.get('party'),
            userType: 'politician'
        };

        // Validate required fields
        if (!this.validateForm(loginData)) {
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        submitBtn.disabled = true;

        try {
            // Simulate authentication (replace with real API call)
            await this.authenticatePolitician(loginData);
            
            // Store politician session data
            this.storePoliticianSession(loginData);
            
            // Show success message
            this.showMessage('Authentication successful! Redirecting to your dashboard...', 'success');
            
            // Redirect to politician dashboard
            setTimeout(() => {
                window.location.href = 'politician-dashboard.html';
            }, 2000);

        } catch (error) {
            this.showMessage(error.message, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        // Check required fields
        const requiredFields = ['fullName', 'politicianId', 'email', 'password', 'position', 'state', 'constituency', 'party'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`, 'error');
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }

        // Validate politician ID format (should be alphanumeric)
        const idRegex = /^[A-Z0-9]{6,12}$/;
        if (!idRegex.test(data.politicianId.toUpperCase())) {
            this.showMessage('Political ID should be 6-12 characters (letters and numbers)', 'error');
            return false;
        }

        return true;
    }

    async authenticatePolitician(loginData) {
        // Simulate API call (replace with actual authentication)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock verification - in real app, this would be server-side
                const validPoliticians = [
                    {
                        id: 'MP001TG',
                        email: 'asaduddin.owaisi@parliament.gov.in',
                        name: 'Asaduddin Owaisi',
                        constituency: 'Hyderabad',
                        state: 'telangana',
                        position: 'mp'
                    },
                    {
                        id: 'MLA001TG',
                        email: 'test.politician@telangana.gov.in',
                        name: 'Test Politician',
                        constituency: 'Hyderabad East',
                        state: 'telangana',
                        position: 'mla'
                    }
                ];

                const politician = validPoliticians.find(p => 
                    p.id === loginData.politicianId.toUpperCase() && 
                    p.email.toLowerCase() === loginData.email.toLowerCase()
                );

                if (politician) {
                    resolve(politician);
                } else {
                    reject(new Error('Invalid credentials or politician not found in our records'));
                }
            }, 1500); // Simulate network delay
        });
    }

    storePoliticianSession(loginData) {
        // Store politician session data in localStorage
        localStorage.setItem('politicianName', loginData.fullName);
        localStorage.setItem('politicianId', loginData.politicianId);
        localStorage.setItem('politicianEmail', loginData.email);
        localStorage.setItem('politicianPosition', loginData.position);
        localStorage.setItem('politicianState', loginData.state);
        localStorage.setItem('politicianConstituency', loginData.constituency);
        localStorage.setItem('politicianParty', loginData.party);
        localStorage.setItem('userType', 'politician');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
    }

    updateConstituencies(state) {
        const constituencyInput = document.getElementById('constituency');
        if (!constituencyInput || !state) return;

        // Mock constituency data (in real app, fetch from API)
        const constituenciesByState = {
            'telangana': [
                'Adilabad', 'Bhongir', 'Chevella', 'Hyderabad', 'Karimnagar', 
                'Khammam', 'Mahabubabad', 'Mahbubnagar', 'Medak', 'Nalgonda',
                'Nizamabad', 'Peddapalle', 'Secunderabad', 'Warangal', 'Zaheerabad'
            ],
            'andhra-pradesh': [
                'Amalapuram', 'Anakapalle', 'Anantapur', 'Araku', 'Bapatla',
                'Chittoor', 'Eluru', 'Guntur', 'Hindupur', 'Kadapa'
            ],
            'maharashtra': [
                'Mumbai North', 'Mumbai South', 'Pune', 'Nagpur', 'Nashik',
                'Aurangabad', 'Kolhapur', 'Sangli', 'Satara', 'Solapur'
            ]
        };

        const constituencies = constituenciesByState[state] || [];
        
        if (constituencies.length > 0) {
            // Convert input to datalist for better UX
            let datalistId = 'constituency-list';
            let existingDatalist = document.getElementById(datalistId);
            
            if (existingDatalist) {
                existingDatalist.remove();
            }

            const datalist = document.createElement('datalist');
            datalist.id = datalistId;
            
            constituencies.forEach(constituency => {
                const option = document.createElement('option');
                option.value = constituency;
                datalist.appendChild(option);
            });
            
            constituencyInput.setAttribute('list', datalistId);
            constituencyInput.parentNode.appendChild(datalist);
            constituencyInput.placeholder = 'Select or type your constituency';
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Insert message before form
        this.form.parentNode.insertBefore(messageDiv, this.form);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Utility function to check if politician is logged in
function isPoliticianLoggedIn() {
    return localStorage.getItem('userType') === 'politician' && 
           localStorage.getItem('isLoggedIn') === 'true';
}

// Utility function to get politician session data
function getPoliticianSession() {
    if (!isPoliticianLoggedIn()) return null;
    
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

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PoliticianAuth();
});

// Add CSS styles dynamically
const authStyles = `
    .auth-message {
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }

    .auth-message.success {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .auth-message.error {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }

    .security-notice {
        background: rgba(255, 193, 7, 0.1);
        border: 1px solid #ffc107;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        text-align: center;
    }

    .security-notice i {
        color: #ffc107;
        margin-right: 8px;
    }

    .help-section {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
        text-align: center;
    }

    .help-section h4 {
        margin-bottom: 15px;
        color: #333;
    }

    .help-section ul {
        list-style: none;
        padding: 0;
        margin: 15px 0 0 0;
    }

    .help-section ul li {
        margin: 8px 0;
        color: #666;
    }

    .help-section ul li i {
        margin-right: 8px;
        color: #ff6b35;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = authStyles;
document.head.appendChild(styleSheet);