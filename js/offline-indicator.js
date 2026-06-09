// Offline Indicator Component
class OfflineIndicator {
  constructor() {
    this.initializeIndicator();
    this.setupEventListeners();
  }

  initializeIndicator() {
    // Create offline indicator if it doesn't exist
    if (!document.getElementById('offlineIndicator')) {
      const indicator = document.createElement('div');
      indicator.id = 'offlineIndicator';
      indicator.className = 'offline-indicator';
      indicator.innerHTML = `
        <div class="offline-content">
          <span class="offline-icon">📶</span>
          <span class="offline-message">You're offline. Some features may be limited.</span>
          <span class="offline-dismiss">✕</span>
        </div>
      `;

      document.body.appendChild(indicator);

      // Add dismiss functionality
      const dismissBtn = indicator.querySelector('.offline-dismiss');
      dismissBtn.addEventListener('click', () => {
        indicator.style.display = 'none';
      });
    }
  }

  setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.hideIndicator();
      this.showReconnectedMessage();
    });

    window.addEventListener('offline', () => {
      this.showIndicator();
    });

    // Check initial connection status
    if (!navigator.onLine) {
      this.showIndicator();
    }
  }

  showIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }

  hideIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  showReconnectedMessage() {
    // Create a temporary reconnected message
    const message = document.createElement('div');
    message.className = 'reconnected-message';
    message.innerHTML = `
      <div class="reconnected-content">
        <span class="reconnected-icon">📶</span>
        <span class="reconnected-message">You're back online.</span>
      </div>
    `;

    document.body.appendChild(message);

    // Animate in
    setTimeout(() => {
      message.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 500);
    }, 3000);
  }
}

// Initialize offline indicator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OfflineIndicator();
});

// Expose to global scope for other scripts
window.OfflineIndicator = OfflineIndicator;
