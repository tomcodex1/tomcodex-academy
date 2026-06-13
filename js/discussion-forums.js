// Discussion Forums System for Salesforce Learning Platform
class DiscussionForums {
  constructor() {
    this.initializeForums();
    this.setupEventListeners();
  }

  initializeForums() {
    // Load forum data from localStorage or API
    this.forums = this.loadForums();
    this.currentUser = this.getCurrentUser();

    // Display forums
    this.displayForums();

    // Display recent discussions
    this.displayRecentDiscussions();
  }

  loadForums() {
    const savedForums = localStorage.getItem('tomcodex.discussionForums');
    if (savedForums) {
      return JSON.parse(savedForums);
    }

    // Default forums if none exist
    return [
      {
        id: 'general-salesforce',
        name: 'General Salesforce',
        description: 'General discussions about Salesforce concepts and best practices',
        topics: ['administration', 'platform', 'general'],
        threadCount: 24,
        lastActivity: new Date().toISOString()
      },
      {
        id: 'admin-questions',
        name: 'Administration Questions',
        description: 'Specific questions about Salesforce administration',
        topics: ['administration', 'security', 'automation'],
        threadCount: 18,
        lastActivity: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'apex-development',
        name: 'Apex Development',
        description: 'Apex code, triggers, and backend development',
        topics: ['apex', 'triggers', 'testing'],
        threadCount: 32,
        lastActivity: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'flow-automation',
        name: 'Flow & Automation',
        description: 'Salesforce Flow and business process automation',
        topics: ['flow', 'automation', 'integration'],
        threadCount: 15,
        lastActivity: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'lwc-development',
        name: 'Lightning Web Components',
        description: 'LWC development, components, and frontend',
        topics: ['lwc', 'javascript', 'html'],
        threadCount: 12,
        lastActivity: new Date(Date.now() - 5400000).toISOString()
      },
      {
        id: 'certification-prep',
        name: 'Certification Prep',
        description: 'Discussion about Salesforce certifications and exam preparation',
        topics: ['certification', 'exam', 'study'],
        threadCount: 9,
        lastActivity: new Date(Date.now() - 900000).toISOString()
      }
    ];
  }

  getCurrentUser() {
    // In a real implementation, this would come from authentication system
    return {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: 'Current User',
      avatar: '👤'
    };
  }

  displayForums() {
    const forumsContainer = document.getElementById('forumsList');
    if (!forumsContainer) return;

    forumsContainer.innerHTML = '';

    this.forums.forEach(forum => {
      const forumCard = document.createElement('div');
      forumCard.className = 'forum-card';
      forumCard.innerHTML = `
        <div class="forum-header">
          <div class="forum-icon">${this.getForumIcon(forum.topics)}</div>
          <div class="forum-info">
            <h3 class="forum-name">${forum.name}</h3>
            <p class="forum-description">${forum.description}</p>
          </div>
        </div>
        <div class="forum-meta">
          <span class="forum-threads">${forum.threadCount} discussions</span>
          <span class="forum-topics">${forum.topics.join(', ')}</span>
          <span class="forum-activity">Last activity: ${this.formatTimeAgo(forum.lastActivity)}</span>
        </div>
        <div class="forum-actions">
          <button class="btn-primary view-forum" data-forum-id="${forum.id}">View Discussions</button>
        </div>
      `;

      forumsContainer.appendChild(forumCard);
    });
  }

  displayRecentDiscussions() {
    const discussionsContainer = document.getElementById('recentDiscussions');
    if (!discussionsContainer) return;

    // Load recent discussions
    const recentDiscussions = this.loadRecentDiscussions();

    discussionsContainer.innerHTML = '';

    if (recentDiscussions.length === 0) {
      discussionsContainer.innerHTML = '<p>No recent discussions. Start a new conversation!</p>';
      return;
    }

    recentDiscussions.forEach(discussion => {
      const discussionCard = document.createElement('div');
      discussionCard.className = 'discussion-card';
      discussionCard.innerHTML = `
        <div class="discussion-header">
          <div class="discussion-title">
            <a href="#" class="discussion-link" data-discussion-id="${discussion.id}">${discussion.title}</a>
          </div>
          <div class="discussion-meta">
            <span class="discussion-forum">in ${discussion.forumName}</span>
            <span class="discussion-author">by ${discussion.author}</span>
            <span class="discussion-time">${this.formatTimeAgo(discussion.createdAt)}</span>
          </div>
        </div>
        <div class="discussion-preview">
          ${discussion.preview}
        </div>
        <div class="discussion-stats">
          <span class="discussion-replies">${discussion.replyCount} replies</span>
          <span class="discussion-views">${discussion.viewCount} views</span>
        </div>
      `;

      discussionsContainer.appendChild(discussionCard);
    });
  }

  loadRecentDiscussions() {
    const savedDiscussions = localStorage.getItem('tomcodex.discussions');
    if (savedDiscussions) {
      return JSON.parse(savedDiscussions).slice(0, 5); // Show only 5 most recent
    }

    // Default discussions if none exist
    return [
      {
        id: 'discussion-1',
        title: 'Best practices for security in Salesforce',
        forumName: 'Administration Questions',
        author: 'Security Expert',
        preview: 'I wanted to share some security best practices I\'ve learned while working with multiple Salesforce orgs...',
        replyCount: 8,
        viewCount: 42,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'discussion-2',
        title: 'Apex trigger optimization techniques',
        forumName: 'Apex Development',
        author: 'Code Master',
        preview: 'When working with large data volumes, trigger performance becomes critical. Here are some optimization techniques...',
        replyCount: 12,
        viewCount: 67,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'discussion-3',
        title: 'Complex flow vs. Apex decision',
        forumName: 'Flow & Automation',
        author: 'Flow Specialist',
        preview: 'When should you choose complex Flow over Apex for automation? Let\'s discuss the pros and cons...',
        replyCount: 6,
        viewCount: 34,
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ];
  }

  getForumIcon(topics) {
    if (topics.includes('administration')) return '👥';
    if (topics.includes('apex')) return '⚡';
    if (topics.includes('flow')) return '🔄';
    if (topics.includes('lwc')) return '🧩';
    if (topics.includes('certification')) return '🏆';
    return '💬';
  }

  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  setupEventListeners() {
    // Handle view forum buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-forum')) {
        const forumId = e.target.getAttribute('data-forum-id');
        this.viewForum(forumId);
      }

      if (e.target.classList.contains('discussion-link')) {
        e.preventDefault();
        const discussionId = e.target.getAttribute('data-discussion-id');
        this.viewDiscussion(discussionId);
      }
    });
  }

  viewForum(forumId) {
    // In a real implementation, this would navigate to the forum page
    const forum = this.forums.find(f => f.id === forumId);
    if (forum) {
      console.log('Viewing forum:', forum);
      // Navigate to forum detail page or show modal
    }
  }

  viewDiscussion(discussionId) {
    // In a real implementation, this would navigate to the discussion page
    console.log('Viewing discussion:', discussionId);
    // Navigate to discussion detail page or show modal
  }

  // Create a new discussion
  createDiscussion(forumId, title, content) {
    const forum = this.forums.find(f => f.id === forumId);
    if (!forum) return null;

    const newDiscussion = {
      id: 'discussion-' + Math.random().toString(36).substr(2, 9),
      title,
      content,
      forumId,
      forumName: forum.name,
      author: this.currentUser.name,
      replyCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      replies: []
    };

    // Save to localStorage
    const discussions = JSON.parse(localStorage.getItem('tomcodex.discussions') || '[]');
    discussions.unshift(newDiscussion);
    localStorage.setItem('tomcodex.discussions', JSON.stringify(discussions));

    // Update forum thread count
    forum.threadCount++;
    forum.lastActivity = new Date().toISOString();
    this.saveForums();

    // Update displays
    this.displayForums();
    this.displayRecentDiscussions();

    return newDiscussion;
  }

  saveForums() {
    localStorage.setItem('tomcodex.discussionForums', JSON.stringify(this.forums));
  }
}

// Initialize discussion forums when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('discussionForumsContainer')) {
    new DiscussionForums();
  }
});

// Expose to global scope for other scripts
window.DiscussionForums = DiscussionForums;
