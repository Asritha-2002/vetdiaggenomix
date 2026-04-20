const alerts = {
    // Type can be 'success', 'error', 'warning', 'info'
    showSideAlert(message, type = 'info', duration = 3000) {
        const alert = document.createElement('div');
        alert.className = `fixed sm:top-4 sm:right-4 sm:w-auto w-full right-0 top-0 p-3 sm:p-4 rounded-none sm:rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50 ${this.getColorClass(type)}`;
        alert.innerHTML = `
            <div class="flex items-center gap-2 max-w-screen-sm mx-auto sm:max-w-md">
                <span class="sm:block hidden">${this.getIcon(type)}</span>
                <span class="block sm:hidden">${this.getSmallIcon(type)}</span>
                <p class="text-xs sm:text-sm font-medium flex-1">${message}</p>
            </div>
        `;
        document.body.appendChild(alert);
        
        // Animate in
        setTimeout(() => alert.classList.remove('translate-x-full'), 100);
        
        // Remove after duration
        setTimeout(() => {
            alert.classList.add('translate-x-full');
            setTimeout(() => alert.remove(), 300);
        }, duration);
    },

    showMainAlert(message, type = 'info', duration = 3000) {
        const alert = document.createElement('div');
        alert.className = `fixed sm:top-4 top-0 left-0 sm:left-1/2 w-full sm:w-auto transform sm:-translate-x-1/2 -translate-y-full transition-transform duration-300 p-3 sm:p-4 rounded-none sm:rounded-lg shadow-lg z-50 ${this.getColorClass(type)}`;
        alert.innerHTML = `
            <div class="flex items-center gap-3 max-w-screen-sm mx-auto sm:max-w-md">
                <span class="sm:block hidden">${this.getIcon(type)}</span>
                <span class="block sm:hidden">${this.getSmallIcon(type)}</span>
                <p class="text-xs sm:text-sm font-medium flex-1">${message}</p>
                <button class="ml-auto hover:opacity-80" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(alert);
        
        // Animate in
        setTimeout(() => alert.classList.remove('-translate-y-full'), 100);
        
        // Remove after duration if not already closed
        if (duration) {
            setTimeout(() => {
                if (document.body.contains(alert)) {
                    alert.classList.add('-translate-y-full');
                    setTimeout(() => alert.remove(), 300);
                }
            }, duration);
        }
    },

    getColorClass(type) {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'error':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'info':
            default:
                return 'bg-blue-100 text-blue-800 border border-blue-200';
        }
    },

    getIcon(type) {
        const iconClass = 'w-5 h-5';
        switch (type) {
            case 'success':
                return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>`;
            case 'error':
                return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>`;
            case 'warning':
                return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>`;
            case 'info':
            default:
                return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>`;
        }
    },

    getSmallIcon(type) {
        const iconClass = 'w-4 h-4';
        return this.getIcon(type).replace('w-5 h-5', iconClass);
    }
};
