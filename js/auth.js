// Authentication JavaScript functionality
class AuthManager {
    constructor() {
        this.initializeEventListeners();
        this.initializeFormValidation();
    }

    initializeEventListeners() {
        // Public login form
        const publicLoginForm = document.getElementById('publicLoginForm');
        if (publicLoginForm) {
            publicLoginForm.addEventListener('submit', (e) => this.handlePublicLogin(e));
        }

        // Politician login form
        const politicianLoginForm = document.getElementById('politicianLoginForm');
        if (politicianLoginForm) {
            politicianLoginForm.addEventListener('submit', (e) => this.handlePoliticianLogin(e));
        }

        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });

        // Two-factor code input formatting
        const twoFactorInput = document.getElementById('twoFactor');
        if (twoFactorInput) {
            twoFactorInput.addEventListener('input', (e) => this.formatTwoFactorCode(e));
        }
    }

    initializeFormValidation() {
        // Real-time validation for email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
            emailInput.addEventListener('input', () => this.clearError('emailError'));
        }

        // Real-time validation for passwords
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('blur', () => this.validatePassword(input));
            input.addEventListener('input', () => this.clearError(input.id + 'Error'));
        });

        // Real-time validation for official ID
        const officialIdInput = document.getElementById('officialId');
        if (officialIdInput) {
            officialIdInput.addEventListener('blur', () => this.validateOfficialId());
            officialIdInput.addEventListener('input', () => this.clearError('officialIdError'));
        }

        // Real-time validation for constituency
        const constituencySelect = document.getElementById('constituency');
        if (constituencySelect) {
            constituencySelect.addEventListener('change', () => this.validateConstituency());
        }
    }

    async handlePublicLogin(e) {
        e.preventDefault();
        
        if (!this.validatePublicLoginForm()) {
            return;
        }

        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            state: formData.get('state'),
            constituency: formData.get('constituency'),
            password: formData.get('password'),
            rememberMe: formData.get('rememberMe') === 'on'
        };

        await this.performLogin('public', loginData, e.target);
    }

    async handlePoliticianLogin(e) {
        e.preventDefault();
        
        if (!this.validatePoliticianLoginForm()) {
            return;
        }

        const formData = new FormData(e.target);
        const loginData = {
            officialId: formData.get('officialId'),
            constituency: formData.get('constituency'),
            password: formData.get('officialPassword'),
            twoFactor: formData.get('twoFactor'),
            secureSession: formData.get('secureSession') === 'on'
        };

        await this.performLogin('politician', loginData, e.target);
    }

    async performLogin(userType, loginData, form) {
        const submitBtn = form.querySelector('.auth-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        try {
            // Show loading state
            this.setLoadingState(submitBtn, btnText, btnLoader, true);

            // Simulate API call
            await this.simulateLoginAPI(userType, loginData);

            // Show success and redirect
            this.showLoginSuccess(userType);
            
            setTimeout(() => {
                this.redirectAfterLogin(userType, loginData);
            }, 2000);

        } catch (error) {
            this.showLoginError(error.message);
            this.setLoadingState(submitBtn, btnText, btnLoader, false);
        }
    }

    async simulateLoginAPI(userType, loginData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate validation
        if (userType === 'public') {
            if (loginData.email === 'demo@citizen.com' && loginData.password === 'citizen123') {
                return { 
                    success: true, 
                    user: { 
                        name: 'Demo Citizen', 
                        type: 'public',
                        email: loginData.email,
                        state: this.getStateDisplayName(loginData.state),
                        constituency: loginData.constituency
                    } 
                };
            }
        } else if (userType === 'politician') {
            if (loginData.officialId === 'MP001' && loginData.password === 'secure123' && loginData.twoFactor === '123456') {
                return { success: true, user: { name: 'Hon. Demo MP', type: 'politician' } };
            }
        }

        throw new Error('Invalid credentials. Please check your details and try again.');
    }

    getStateDisplayName(stateValue) {
        const stateMap = {
            'andhra-pradesh': 'Andhra Pradesh',
            'assam': 'Assam',
            'bihar': 'Bihar',
            'chhattisgarh': 'Chhattisgarh',
            'goa': 'Goa',
            'gujarat': 'Gujarat',
            'haryana': 'Haryana',
            'himachal-pradesh': 'Himachal Pradesh',
            'jharkhand': 'Jharkhand',
            'karnataka': 'Karnataka',
            'kerala': 'Kerala',
            'madhya-pradesh': 'Madhya Pradesh',
            'maharashtra': 'Maharashtra',
            'manipur': 'Manipur',
            'meghalaya': 'Meghalaya',
            'mizoram': 'Mizoram',
            'nagaland': 'Nagaland',
            'odisha': 'Odisha',
            'punjab': 'Punjab',
            'rajasthan': 'Rajasthan',
            'sikkim': 'Sikkim',
            'tamil-nadu': 'Tamil Nadu',
            'telangana': 'Telangana',
            'tripura': 'Tripura',
            'uttar-pradesh': 'Uttar Pradesh',
            'uttarakhand': 'Uttarakhand',
            'west-bengal': 'West Bengal',
            'delhi': 'Delhi',
            'chandigarh': 'Chandigarh'
        };
        return stateMap[stateValue] || stateValue;
    }

    validatePublicLoginForm() {
        let isValid = true;

        // Validate email
        if (!this.validateEmail()) {
            isValid = false;
        }

        // Validate state
        if (!this.validateState()) {
            isValid = false;
        }

        // Validate constituency
        if (!this.validateConstituencyLogin()) {
            isValid = false;
        }

        // Validate password
        const passwordInput = document.getElementById('password');
        if (!this.validatePassword(passwordInput)) {
            isValid = false;
        }

        return isValid;
    }

    validatePoliticianLoginForm() {
        let isValid = true;

        // Validate official ID
        if (!this.validateOfficialId()) {
            isValid = false;
        }

        // Validate constituency
        if (!this.validateConstituency()) {
            isValid = false;
        }

        // Validate password
        const passwordInput = document.getElementById('officialPassword');
        if (!this.validatePassword(passwordInput)) {
            isValid = false;
        }

        // Validate two-factor code
        if (!this.validateTwoFactor()) {
            isValid = false;
        }

        return isValid;
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        
        if (!emailInput) return true;

        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError(emailError, 'Email address is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError(emailError, 'Please enter a valid email address');
            return false;
        }

        this.clearError('emailError');
        return true;
    }

    validatePassword(passwordInput) {
        if (!passwordInput) return true;

        const password = passwordInput.value;
        const errorElement = document.getElementById(passwordInput.id + 'Error');

        if (!password) {
            this.showError(errorElement, 'Password is required');
            return false;
        }

        if (password.length < 6) {
            this.showError(errorElement, 'Password must be at least 6 characters long');
            return false;
        }

        this.clearError(passwordInput.id + 'Error');
        return true;
    }

    validateOfficialId() {
        const officialIdInput = document.getElementById('officialId');
        const officialIdError = document.getElementById('officialIdError');
        
        if (!officialIdInput) return true;

        const officialId = officialIdInput.value.trim();

        if (!officialId) {
            this.showError(officialIdError, 'Official ID is required');
            return false;
        }

        if (officialId.length < 3) {
            this.showError(officialIdError, 'Please enter a valid official ID');
            return false;
        }

        this.clearError('officialIdError');
        return true;
    }

    validateConstituency() {
        const constituencySelect = document.getElementById('constituency');
        const constituencyError = document.getElementById('constituencyError');
        
        if (!constituencySelect) return true;

        const constituency = constituencySelect.value;

        if (!constituency) {
            this.showError(constituencyError, 'Please select your constituency or department');
            return false;
        }

        this.clearError('constituencyError');
        return true;
    }

    validateTwoFactor() {
        const twoFactorInput = document.getElementById('twoFactor');
        const twoFactorError = document.getElementById('twoFactorError');
        
        if (!twoFactorInput) return true;

        const twoFactor = twoFactorInput.value.trim();

        if (!twoFactor) {
            this.showError(twoFactorError, 'Two-factor authentication code is required');
            return false;
        }

        if (!/^\d{6}$/.test(twoFactor)) {
            this.showError(twoFactorError, 'Please enter a valid 6-digit code');
            return false;
        }

        this.clearError('twoFactorError');
        return true;
    }

    validateState() {
        const stateSelect = document.getElementById('state');
        const stateError = document.getElementById('stateError');
        
        if (!stateSelect) return true;

        const state = stateSelect.value;

        if (!state) {
            this.showError(stateError, 'Please select your state');
            return false;
        }

        this.clearError('stateError');
        return true;
    }

    validateConstituencyLogin() {
        const constituencyInput = document.getElementById('constituency');
        const constituencyError = document.getElementById('constituencyError');
        
        if (!constituencyInput) return true;

        const constituency = constituencyInput.value.trim();

        if (!constituency) {
            this.showError(constituencyError, 'Please enter your constituency name');
            return false;
        }

        if (constituency.length < 3) {
            this.showError(constituencyError, 'Please enter a valid constituency name');
            return false;
        }

        this.clearError('constituencyError');
        return true;
    }

    formatTwoFactorCode(e) {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value.slice(0, 6);
    }

    showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#dc3545';
        }
    }

    clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    setLoadingState(button, textElement, loaderElement, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.style.opacity = '0.8';
            textElement.style.display = 'none';
            loaderElement.style.display = 'flex';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            textElement.style.display = 'inline';
            loaderElement.style.display = 'none';
        }
    }

    showLoginSuccess(userType) {
        const message = userType === 'public' ? 
            'Login successful! Redirecting to your dashboard...' :
            'Secure login successful! Redirecting to official dashboard...';
        
        this.showNotification(message, 'success');
    }

    showLoginError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    redirectAfterLogin(userType, loginData) {
        if (userType === 'public') {
            // Store user data in localStorage
            localStorage.setItem('userType', 'public');
            localStorage.setItem('userName', 'Demo Citizen');
            localStorage.setItem('userEmail', loginData.email);
            localStorage.setItem('userState', this.getStateDisplayName(loginData.state));
            localStorage.setItem('userConstituency', loginData.constituency);
            window.location.href = 'citizen-dashboard.html';
        } else if (userType === 'politician') {
            // Store official data in localStorage
            localStorage.setItem('userType', 'politician');
            localStorage.setItem('userName', 'Hon. Demo MP');
            localStorage.setItem('constituency', loginData.constituency);
            window.location.href = 'politicians.html';
        }
    }

    handleSocialLogin(e) {
        const provider = e.currentTarget.textContent.trim().toLowerCase();
        
        this.showNotification(`${provider} login will be available soon!`, 'info');
        
        // Simulate social login
        console.log(`Initiating ${provider} login...`);
    }
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + 'ToggleIcon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
    
    // Add demo credentials info
    if (window.location.pathname.includes('public-login.html')) {
        addDemoInfo('public');
    } else if (window.location.pathname.includes('politician-login.html')) {
        addDemoInfo('politician');
    }
});

function addDemoInfo(type) {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const demoInfo = document.createElement('div');
    demoInfo.className = 'demo-info';
    demoInfo.style.cssText = `
        background: #e7f3ff;
        border: 1px solid #b8daff;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
        font-size: 0.9rem;
        color: #004085;
    `;

    if (type === 'public') {
        demoInfo.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">
                <i class="fas fa-info-circle"></i> Demo Credentials
            </div>
            <div><strong>Email:</strong> demo@citizen.com</div>
            <div><strong>State:</strong> Any state</div>
            <div><strong>Constituency:</strong> Any constituency</div>
            <div><strong>Password:</strong> citizen123</div>
        `;
    } else {
        demoInfo.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">
                <i class="fas fa-info-circle"></i> Demo Credentials
            </div>
            <div><strong>Official ID:</strong> MP001</div>
            <div><strong>Password:</strong> secure123</div>
            <div><strong>2FA Code:</strong> 123456</div>
        `;
    }

    form.insertBefore(demoInfo, form.firstChild);
}