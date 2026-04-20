const auth = {
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    async updateAuthUI() {
        const authButton = document.getElementById('auth-button');
        if (!authButton) return; // Add null check
        
        if (this.isAuthenticated()) {
            authButton.innerHTML = `<i class="fas fa-user-circle text-xl"></i>`;
            authButton.onclick = this.showUserMenu;
        } else {
            authButton.innerHTML = `<i class="fas fa-user text-xl"></i>`;
            authButton.onclick = () => {
                const loginModal = document.getElementById('login-modal');
                if (loginModal) loginModal.classList.remove('hidden');
            };
        }
    },

    showUserMenu() {
        // TODO: Implement dropdown menu with logout option
        window.location.href = '/profile';
    },

    async login(credentials) {
        const response = await api.login(credentials);
        localStorage.setItem('token', response.token);
        await this.updateAuthUI();
        return response;
    },

    async signup(userData) {
        const response = await api.signup(userData);
        localStorage.setItem('token', response.token);
        await this.updateAuthUI();
        return response;
    },

    logout() {
        localStorage.removeItem('token');
        this.updateAuthUI();
        window.location.href = '/';
    }
};

// Initialize auth state
document.addEventListener('DOMContentLoaded', () => {
    try {
        auth.updateAuthUI();
    } catch (error) {
        console.warn('Auth UI initialization failed:', error);
    }

    document.getElementById('forgot-password-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email');
            
            await api.forgotPassword(email);
            showAlert('success', 'Password reset link sent to your email');
            toggleModal('forgot-password-modal');
        } catch (error) {
            showAlert('error', error.message);
        }
    });

    document.getElementById('reset-password-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            const token = formData.get('token');

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            await api.resetPassword(token, password);
            showAlert('success', 'Password reset successful');
            toggleModal('reset-password-modal');
            toggleModal('login-modal');
        } catch (error) {
            showAlert('error', error.message);
        }
    });
});

// Check for reset token in URL
if (window.location.hash.startsWith('#reset-password=')) {
    const token = window.location.hash.split('=')[1];
    document.getElementById('reset-token').value = token;
    toggleModal('reset-password-modal');
}
