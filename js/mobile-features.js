// Mobile Features for Salesforce Learning Platform
class MobileFeatures {
  constructor() {
    this.initializeOfflineSupport();
    this.initializeNotifications();
    this.initializeTouchOptimizations();
    this.initializeMobileNavigation();
    this.initializeResponsiveImages();
    this.initializePWA();
  }

  initializeOfflineSupport() {
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.showOfflineIndicator(false);
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.showOfflineIndicator(true);
    });

    // Check initial connection status
    if (!navigator.onLine) {
      this.showOfflineIndicator(true);
    }
  }

  showOfflineIndicator(show) {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.style.display = show ? 'block' : 'none';
    }
  }

  syncOfflineData() {
    // Sync any offline data when back online
    const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');

    if (Object.keys(offlineData).length > 0) {
      // In a real implementation, this would sync with a server
      console.log('Syncing offline data:', offlineData);

      // Clear synced data
      localStorage.removeItem('offlineData');
    }
  }

  storeOfflineData(data) {
    const offlineData = JSON.parse(localStorage.getItem('offlineData') || '{}');
    offlineData[new Date().toISOString()] = data;
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
  }

  initializeNotifications() {
    // Check for notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      // Request permission on user interaction
      document.addEventListener('click', () => {
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }, { once: true });
    }

    // Set up notification listeners
    document.addEventListener('learningReminder', (event) => {
      this.sendNotification('Learning Reminder', event.detail.message);
    });

    document.addEventListener('achievementUnlocked', (event) => {
      this.sendNotification('Achievement Unlocked!', event.detail.message);
    });
  }

  sendNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notificationOptions = {
      icon: '/assets/tomcodex-logo.svg',
      badge: '/assets/tomcodex-logo.svg',
      body: options.message || 'You have a new notification',
      tag: 'salesforce-learning',
      renotify: true,
      requireInteraction: false,
      ...options
    };

    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, notificationOptions);
    });
  }

  initializeTouchOptimizations() {
    // Add touch event handlers for better mobile experience
    document.addEventListener('touchstart', (e) => {
      // Add touch feedback
      if (e.target.classList.contains('button')) {
        e.target.classList.add('touch-active');
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      // Remove touch feedback
      if (e.target.classList.contains('button')) {
        e.target.classList.remove('touch-active');
      }
    });

    // Optimize scrolling for mobile
    const scrollContainers = document.querySelectorAll('.scroll-container');
    scrollContainers.forEach(container => {
      let isDown = false;
      let startY;
      let scrollTop;

      container.addEventListener('touchstart', (e) => {
        isDown = true;
        startY = e.touches[0].clientY + container.scrollTop;
        scrollTop = container.scrollTop;
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.touches[0].clientY;
        const walk = (y - startY) * 2;
        container.scrollTop = scrollTop - walk;
      }, { passive: false });

      container.addEventListener('touchend', () => {
        isDown = false;
      });
    });
  }

  initializeMobileNavigation() {
    // Create bottom navigation for mobile
    if (window.innerWidth <= 768 && !document.getElementById('bottomNav')) {
      const bottomNav = document.createElement('nav');
      bottomNav.id = 'bottomNav';
      bottomNav.className = 'bottom-nav';

      const navItems = [
        { icon: '📚', label: 'Learn', href: 'dashboard.html' },
        { icon: '📊', label: 'Analytics', href: 'analytics-enhanced.html' },
        { icon: '🏆', label: 'Gamify', href: 'gamification-dashboard.html' },
        { icon: '❓', label: 'Help', href: 'help.html' }
      ];

      navItems.forEach(item => {
        const navLink = document.createElement('a');
        navLink.href = item.href;
        navLink.className = 'bottom-nav-item';
        navLink.innerHTML = `
          <span class="bottom-nav-icon">${item.icon}</span>
          <span class="bottom-nav-label">${item.label}</span>
        `;
        bottomNav.appendChild(navLink);
      });

      document.body.appendChild(bottomNav);

      // Highlight active page
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = bottomNav.querySelectorAll('.bottom-nav-item');
      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        }
      });
    }
  }

  initializeResponsiveImages() {
    // Implement responsive images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('fade-in');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  initializePWA() {
    // Check if app can be installed
    if ('InstallEvent' in window) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.installPrompt = e;

        // Show install button
        const installButton = document.getElementById('installButton');
        if (installButton) {
          installButton.style.display = 'block';
          installButton.addEventListener('click', () => {
            this.installPrompt.prompt();
            this.installPrompt.userChoice.then(choiceResult => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
              } else {
                console.log('User dismissed the install prompt');
              }
              this.installPrompt = null;
            });
          });
        }
      });
    }
  }

  // Public methods for other scripts to use
  scheduleNotification(options) {
    // Schedule a notification for later
    if ('Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const scheduledTime = new Date(options.time);
      const delay = scheduledTime - now;

      if (delay > 0) {
        setTimeout(() => {
          this.sendNotification(options.title, options);
        }, delay);
      } else {
        this.sendNotification(options.title, options);
      }
    }
  }

  downloadForOffline(content, filename) {
    // Save content for offline access
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Initialize mobile features when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth <= 768) {
    new MobileFeatures();
  }
});

// Expose to global scope for other scripts
window.MobileFeatures = MobileFeatures;
