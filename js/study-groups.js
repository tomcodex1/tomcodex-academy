// Study Groups System for Salesforce Learning Platform
class StudyGroups {
  constructor() {
    this.initializeGroups();
    this.setupEventListeners();
  }

  initializeGroups() {
    // Load existing groups from localStorage or API
    this.groups = this.loadGroups();
    this.currentUser = this.getCurrentUser();

    // Display groups
    this.displayGroups();

    // Display user's groups
    this.displayUserGroups();
  }

  loadGroups() {
    const savedGroups = localStorage.getItem('tomcodex.studyGroups');
    if (savedGroups) {
      return JSON.parse(savedGroups);
    }

    // Default groups if none exist
    return [
      {
        id: 'salesforce-admin-group',
        name: 'Salesforce Admin Learners',
        description: 'A group for those learning Salesforce administration fundamentals',
        members: 24,
        maxMembers: 50,
        topics: ['administration', 'security', 'automation'],
        created: new Date().toISOString(),
        isPrivate: false,
        memberIds: []
      },
      {
        id: 'apex-developers-group',
        name: 'Apex Developers',
        description: 'For developers mastering Apex programming and Salesforce backend',
        members: 18,
        maxMembers: 40,
        topics: ['apex', 'triggers', 'testing'],
        created: new Date().toISOString(),
        isPrivate: true,
        memberIds: []
      },
      {
        id: 'flow-automation-group',
        name: 'Flow Automation Experts',
        description: 'Focused on Salesforce Flow and business process automation',
        members: 15,
        maxMembers: 35,
        topics: ['flow', 'automation', 'integration'],
        created: new Date().toISOString(),
        isPrivate: false,
        memberIds: []
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

  displayGroups() {
    const groupsContainer = document.getElementById('availableGroups');
    if (!groupsContainer) return;

    groupsContainer.innerHTML = '';

    this.groups.forEach(group => {
      const groupCard = document.createElement('div');
      groupCard.className = 'group-card';
      groupCard.innerHTML = `
        <div class="group-header">
          <div class="group-icon">${this.getGroupIcon(group.topics)}</div>
          <div class="group-info">
            <h3 class="group-name">${group.name}</h3>
            <p class="group-description">${group.description}</p>
          </div>
        </div>
        <div class="group-meta">
          <span class="group-members">${group.members}/${group.maxMembers} members</span>
          <span class="group-topics">${group.topics.join(', ')}</span>
          ${group.isPrivate ? '<span class="group-private">Private</span>' : ''}
        </div>
        <div class="group-actions">
          ${this.isUserMember(group.id) ?
            '<button class="btn-secondary leave-group" data-group-id="' + group.id + '">Leave Group</button>' :
            '<button class="btn-primary join-group" data-group-id="' + group.id + '">Join Group</button>'
          }
          <button class="btn-outline view-group" data-group-id="${group.id}">View</button>
        </div>
      `;

      groupsContainer.appendChild(groupCard);
    });
  }

  displayUserGroups() {
    const userGroupsContainer = document.getElementById('userGroups');
    if (!userGroupsContainer) return;

    const userGroups = this.groups.filter(group => this.isUserMember(group.id));

    if (userGroups.length === 0) {
      userGroupsContainer.innerHTML = '<p>You are not a member of any study groups yet.</p>';
      return;
    }

    userGroupsContainer.innerHTML = '';

    userGroups.forEach(group => {
      const groupCard = document.createElement('div');
      groupCard.className = 'user-group-card';
      groupCard.innerHTML = `
        <div class="group-header">
          <div class="group-icon">${this.getGroupIcon(group.topics)}</div>
          <div class="group-info">
            <h3 class="group-name">${group.name}</h3>
            <p class="group-description">${group.description}</p>
          </div>
        </div>
        <div class="group-meta">
          <span class="group-members">${group.members}/${group.maxMembers} members</span>
        </div>
        <div class="group-actions">
          <button class="btn-primary view-group" data-group-id="${group.id}">View Group</button>
          <button class="btn-secondary leave-group" data-group-id="${group.id}">Leave</button>
        </div>
      `;

      userGroupsContainer.appendChild(groupCard);
    });
  }

  getGroupIcon(topics) {
    if (topics.includes('administration')) return '👥';
    if (topics.includes('apex')) return '⚡';
    if (topics.includes('flow')) return '🔄';
    if (topics.includes('integration')) return '🔗';
    return '📚';
  }

  isUserMember(groupId) {
    // In a real implementation, this would check actual membership
    return Math.random() > 0.7; // Random for demo purposes
  }

  joinGroup(groupId) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group || this.isUserMember(groupId)) return;

    if (group.members < group.maxMembers) {
      group.members++;
      group.memberIds.push(this.currentUser.id);
      this.saveGroups();
      this.displayGroups();
      this.displayUserGroups();

      // Show notification
      this.showNotification(`You've joined ${group.name}!`);
    } else {
      this.showNotification('This group is already full.', 'error');
    }
  }

  leaveGroup(groupId) {
    const group = this.groups.find(g => g.id === groupId);
    if (!group || !this.isUserMember(groupId)) return;

    group.members--;
    group.memberIds = group.memberIds.filter(id => id !== this.currentUser.id);
    this.saveGroups();
    this.displayGroups();
    this.displayUserGroups();

    // Show notification
    this.showNotification(`You've left ${group.name}.`);
  }

  saveGroups() {
    localStorage.setItem('tomcodex.studyGroups', JSON.stringify(this.groups));
  }

  showNotification(message, type = 'success') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  setupEventListeners() {
    // Handle join group buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('join-group')) {
        const groupId = e.target.getAttribute('data-group-id');
        this.joinGroup(groupId);
      }

      if (e.target.classList.contains('leave-group')) {
        const groupId = e.target.getAttribute('data-group-id');
        this.leaveGroup(groupId);
      }

      if (e.target.classList.contains('view-group')) {
        const groupId = e.target.getAttribute('data-group-id');
        this.viewGroup(groupId);
      }
    });
  }

  viewGroup(groupId) {
    // In a real implementation, this would navigate to the group page
    const group = this.groups.find(g => g.id === groupId);
    if (group) {
      console.log('Viewing group:', group);
      // Navigate to group detail page or show modal
    }
  }

  // Create a new study group
  createGroup(name, description, topics, isPrivate) {
    const newGroup = {
      id: 'group-' + Math.random().toString(36).substr(2, 9),
      name,
      description,
      members: 1, // Creator is automatically a member
      maxMembers: 30,
      topics,
      created: new Date().toISOString(),
      isPrivate,
      memberIds: [this.currentUser.id]
    };

    this.groups.push(newGroup);
    this.saveGroups();
    this.displayGroups();
    this.displayUserGroups();

    return newGroup;
  }
}

// Initialize study groups when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('studyGroupsContainer')) {
    new StudyGroups();
  }
});

// Expose to global scope for other scripts
window.StudyGroups = StudyGroups;
