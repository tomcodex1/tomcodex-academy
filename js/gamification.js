// Gamification System for Salesforce Learning Platform
class GamificationSystem {
  constructor() {
    this.initializeBadges();
    this.initializeStreaks();
    this.initializeLeaderboards();
    this.setupEventListeners();
  }

  initializeBadges() {
    // Define all available badges
    this.badges = [
      {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Complete your first learning module',
        icon: '🚶',
        category: 'milestone'
      },
      {
        id: 'week-streak',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'streak'
      },
      {
        id: 'admin-master',
        name: 'Admin Master',
        description: 'Complete all Salesforce Admin modules',
        icon: '👑',
        category: 'course'
      },
      {
        id: 'apex-champion',
        name: 'Apex Champion',
        description: 'Complete all Apex Development modules',
        icon: '⚡',
        category: 'course'
      },
      {
        id: 'flow-creator',
        name: 'Flow Creator',
        description: 'Complete all Salesforce Flow modules',
        icon: '🔄',
        category: 'course'
      },
      {
        id: 'lwc-builder',
        name: 'LWC Builder',
        description: 'Complete all Lightning Web Components modules',
        icon: '🧱',
        category: 'course'
      },
      {
        id: 'knowledge-seeker',
        name: 'Knowledge Seeker',
        description: 'Ask 50 questions to Zentom AI',
        icon: '❓',
        category: 'engagement'
      },
      {
        id: 'practice-makes-perfect',
        name: 'Practice Makes Perfect',
        description: 'Complete 100 Trailhead challenges',
        icon: '💪',
        category: 'practice'
      },
      {
        id: 'interview-ready',
        name: 'Interview Ready',
        description: 'Complete 10 mock interviews',
        icon: '🎤',
        category: 'preparation'
      },
      {
        id: 'continuous-learner',
        name: 'Continuous Learner',
        description: 'Maintain a 30-day learning streak',
        icon: '📚',
        category: 'streak'
      }
    ];

    // Load user's earned badges
    this.earnedBadges = this.loadEarnedBadges();

    // Display badges
    this.displayBadges();
  }

  initializeStreaks() {
    // Load streak data
    this.streakData = this.loadStreakData();

    // Calculate current streak
    this.calculateCurrentStreak();

    // Display streak information
    this.displayStreaks();
  }

  initializeLeaderboards() {
    // Load leaderboard data
    this.leaderboardData = this.loadLeaderboardData();

    // Display leaderboards
    this.displayLeaderboards();
  }

  loadEarnedBadges() {
    const savedBadges = localStorage.getItem('tomcodex.earnedBadges');
    return savedBadges ? JSON.parse(savedBadges) : [];
  }

  saveEarnedBadges() {
    localStorage.setItem('tomcodex.earnedBadges', JSON.stringify(this.earnedBadges));
  }

  loadStreakData() {
    const savedStreaks = localStorage.getItem('tomcodex.streakData');
    return savedStreaks ? JSON.parse(savedStreaks) : {
      lastActiveDate: null,
      currentStreak: 0,
      longestStreak: 0,
      activityDates: []
    };
  }

  saveStreakData() {
    localStorage.setItem('tomcodex.streakData', JSON.stringify(this.streakData));
  }

  loadLeaderboardData() {
    // In a real implementation, this would come from a server
    // For now, we'll use mock data
    return [
      { name: 'Alex Johnson', points: 2450, modules: 18, streak: 15 },
      { name: 'Sam Rivera', points: 1980, modules: 15, streak: 12 },
      { name: 'Jordan Smith', points: 1750, modules: 13, streak: 9 },
      { name: 'Taylor Kim', points: 1620, modules: 12, streak: 7 },
      { name: 'Morgan Lee', points: 1480, modules: 10, streak: 6 }
    ];
  }

  checkAndAwardBadges(activity) {
    const newBadges = [];

    // Check for milestone badges
    if (activity.type === 'moduleComplete') {
      // First module badge
      if (!this.earnedBadges.includes('first-steps') && this.getCompletedModulesCount() === 1) {
        this.earnedBadges.push('first-steps');
        newBadges.push(this.badges.find(b => b.id === 'first-steps'));
      }

      // Course completion badges
      if (this.isCourseCompleted('admin')) {
        if (!this.earnedBadges.includes('admin-master')) {
          this.earnedBadges.push('admin-master');
          newBadges.push(this.badges.find(b => b.id === 'admin-master'));
        }
      }

      if (this.isCourseCompleted('apex')) {
        if (!this.earnedBadges.includes('apex-champion')) {
          this.earnedBadges.push('apex-champion');
          newBadges.push(this.badges.find(b => b.id === 'apex-champion'));
        }
      }

      if (this.isCourseCompleted('flow')) {
        if (!this.earnedBadges.includes('flow-creator')) {
          this.earnedBadges.push('flow-creator');
          newBadges.push(this.badges.find(b => b.id === 'flow-creator'));
        }
      }

      if (this.isCourseCompleted('lwc')) {
        if (!this.earnedBadges.includes('lwc-builder')) {
          this.earnedBadges.push('lwc-builder');
          newBadges.push(this.badges.find(b => b.id === 'lwc-builder'));
        }
      }
    }

    // Check for streak badges
    if (activity.type === 'dailyActivity') {
      if (this.streakData.currentStreak === 7 && !this.earnedBadges.includes('week-streak')) {
        this.earnedBadges.push('week-streak');
        newBadges.push(this.badges.find(b => b.id === 'week-streak'));
      }

      if (this.streakData.currentStreak === 30 && !this.earnedBadges.includes('continuous-learner')) {
        this.earnedBadges.push('continuous-learner');
        newBadges.push(this.badges.find(b => b.id === 'continuous-learner'));
      }
    }

    // Save earned badges
    if (newBadges.length > 0) {
      this.saveEarnedBadges();
      this.displayBadges();
      this.showBadgeNotifications(newBadges);
    }
  }

  isCourseCompleted(course) {
    // In a real implementation, this would check actual course progress
    const completedModules = this.getCompletedModulesCount();
    return completedModules >= 12; // Assuming 12 modules per course
  }

  getCompletedModulesCount() {
    const progressData = JSON.parse(localStorage.getItem('salesforceMasterDashboard.v1') || '{}');
    return Object.keys(progressData.completedTasks || {}).filter(key => key.includes('module')).length;
  }

  calculateCurrentStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If there's no last active date, start a new streak
    if (!this.streakData.lastActiveDate) {
      this.streakData.currentStreak = 1;
      this.streakData.lastActiveDate = today.toISOString();
      this.saveStreakData();
      return;
    }

    const lastActive = new Date(this.streakData.lastActiveDate);
    const daysSinceLastActive = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (daysSinceLastActive === 0) {
      // Already marked active today, no change
      return;
    } else if (daysSinceLastActive === 1) {
      // Consecutive day, increment streak
      this.streakData.currentStreak += 1;
      this.streakData.lastActiveDate = today.toISOString();

      // Update longest streak if needed
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak;
      }
    } else {
      // Streak broken, reset to 1
      this.streakData.currentStreak = 1;
      this.streakData.lastActiveDate = today.toISOString();
    }

    this.saveStreakData();
  }

  recordActivity(activity) {
    // Update streak data
    if (activity.type === 'dailyActivity') {
      this.calculateCurrentStreak();
      this.displayStreaks();
    }

    // Check for new badges
    this.checkAndAwardBadges(activity);

    // Update points
    this.updatePoints(activity);

    // Update leaderboards
    this.updateLeaderboards(activity);
  }

  updatePoints(activity) {
    // Define point values for different activities
    const pointValues = {
      moduleComplete: 100,
      dailyActivity: 10,
      trailheadChallenge: 20,
      masteryTest: 50,
      interviewPractice: 30,
      aiQuestion: 5
    };

    const pointsEarned = pointValues[activity.type] || 0;

    // In a real implementation, this would update user points in the database
    // For now, we'll just log it
    console.log(`Earned ${pointsEarned} points for ${activity.type}`);
  }

  updateLeaderboards(activity) {
    // In a real implementation, this would update server-side leaderboards
    // For now, we'll just refresh the display
    this.displayLeaderboards();
  }

  displayBadges() {
    const badgesContainer = document.getElementById('userBadges');
    if (!badgesContainer) return;

    badgesContainer.innerHTML = '';

    // Display earned badges
    this.earnedBadges.forEach(badgeId => {
      const badge = this.badges.find(b => b.id === badgeId);
      if (badge) {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge earned';
        badgeElement.innerHTML = `
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-info">
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
          </div>
        `;
        badgesContainer.appendChild(badgeElement);
      }
    });

    // Display available but not earned badges
    const availableBadges = this.badges.filter(badge => !this.earnedBadges.includes(badge.id));
    availableBadges.forEach(badge => {
      const badgeElement = document.createElement('div');
      badgeElement.className = 'badge locked';
      badgeElement.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-info">
          <div class="badge-name">${badge.name}</div>
          <div class="badge-description">${badge.description}</div>
        </div>
      `;
      badgesContainer.appendChild(badgeElement);
    });
  }

  displayStreaks() {
    const streakContainer = document.getElementById('userStreak');
    if (!streakContainer) return;

    streakContainer.innerHTML = `
      <div class="streak-current">
        <div class="streak-number">${this.streakData.currentStreak}</div>
        <div class="streak-label">Current Streak</div>
      </div>
      <div class="streak-longest">
        <div class="streak-number">${this.streakData.longestStreak}</div>
        <div class="streak-label">Longest Streak</div>
      </div>
    `;
  }

  displayLeaderboards() {
    const leaderboardContainer = document.getElementById('leaderboard');
    if (!leaderboardContainer) return;

    leaderboardContainer.innerHTML = '';

    // Create leaderboard table
    const leaderboardTable = document.createElement('table');
    leaderboardTable.className = 'leaderboard-table';

    // Table header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Rank</th>
      <th>Learner</th>
      <th>Points</th>
      <th>Modules</th>
      <th>Streak</th>
    `;
    leaderboardTable.appendChild(headerRow);

    // Table rows
    this.leaderboardData.forEach((user, index) => {
      const row = document.createElement('tr');
      row.className = index < 3 ? 'top-three' : '';
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.points}</td>
        <td>${user.modules}</td>
        <td>${user.streak}</td>
      `;
      leaderboardTable.appendChild(row);
    });

    leaderboardContainer.appendChild(leaderboardTable);
  }

  showBadgeNotifications(newBadges) {
    // Create notification for each new badge
    newBadges.forEach(badge => {
      const notification = document.createElement('div');
      notification.className = 'badge-notification';
      notification.innerHTML = `
        <div class="notification-icon">${badge.icon}</div>
        <div class="notification-content">
          <div class="notification-title">New Badge Earned!</div>
          <div class="notification-message">${badge.name}: ${badge.description}</div>
        </div>
      `;

      document.body.appendChild(notification);

      // Animate notification
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);

      // Remove notification after 5 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 5000);
    });
  }

  setupEventListeners() {
    // Listen for completed modules
    document.addEventListener('moduleCompleted', (event) => {
      this.recordActivity({
        type: 'moduleComplete',
        moduleId: event.detail.moduleId,
        timestamp: new Date()
      });
    });

    // Listen for daily activity
    document.addEventListener('dailyActivity', (event) => {
      this.recordActivity({
        type: 'dailyActivity',
        date: new Date().toISOString(),
        timestamp: new Date()
      });
    });

    // Listen for Trailhead challenges
    document.addEventListener('trailheadChallenge', (event) => {
      this.recordActivity({
        type: 'trailheadChallenge',
        challengeId: event.detail.challengeId,
        timestamp: new Date()
      });
    });

    // Listen for mastery tests
    document.addEventListener('masteryTest', (event) => {
      this.recordActivity({
        type: 'masteryTest',
        moduleId: event.detail.moduleId,
        score: event.detail.score,
        timestamp: new Date()
      });
    });

    // Listen for interview practice
    document.addEventListener('interviewPractice', (event) => {
      this.recordActivity({
        type: 'interviewPractice',
        interviewType: event.detail.interviewType,
        timestamp: new Date()
      });
    });

    // Listen for AI questions
    document.addEventListener('aiQuestion', (event) => {
      this.recordActivity({
        type: 'aiQuestion',
        timestamp: new Date()
      });
    });
  }
}

// Initialize the gamification system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gamificationContainer')) {
    new GamificationSystem();
  }
});
