// Enhanced Analytics Dashboard
class EnhancedAnalytics {
  constructor() {
    this.initializeCharts();
    this.loadLearningData();
    this.setupEventListeners();
  }

  initializeCharts() {
    // Initialize chart libraries or create custom chart implementations
    this.skillChart = this.createSkillChart();
    this.progressChart = this.createProgressChart();
    this.timeChart = this.createTimeChart();
  }

  createSkillChart() {
    // Create a radar/spider chart for skill visualization
    const canvas = document.createElement('canvas');
    canvas.id = 'skillChart';
    document.getElementById('skillVisualization').appendChild(canvas);

    // Implementation would use a charting library or custom canvas drawing
    // This is a placeholder for the actual implementation
    return {
      update: (skills) => {
        // Update chart with new skill data
        console.log('Updating skill chart with:', skills);
      }
    };
  }

  createProgressChart() {
    // Create a line chart for progress over time
    const canvas = document.createElement('canvas');
    canvas.id = 'progressChart';
    document.getElementById('progressOverTime').appendChild(canvas);

    return {
      update: (progressData) => {
        // Update chart with progress data
        console.log('Updating progress chart with:', progressData);
      }
    };
  }

  createTimeChart() {
    // Create a bar chart for time spent on different activities
    const canvas = document.createElement('canvas');
    canvas.id = 'timeChart';
    document.getElementById('timeDistribution').appendChild(canvas);

    return {
      update: (timeData) => {
        // Update chart with time data
        console.log('Updating time chart with:', timeData);
      }
    };
  }

  loadLearningData() {
    // Load user's learning data from storage
    const progressData = JSON.parse(localStorage.getItem('salesforceMasterDashboard.v1') || '{}');
    const skillData = this.calculateSkillGaps(progressData);
    const timeData = this.calculateTimeSpent(progressData);

    // Update charts with loaded data
    this.skillChart.update(skillData);
    this.progressChart.update(progressData.history || []);
    this.timeChart.update(timeData);

    // Update skill gap analysis section
    this.updateSkillGaps(skillData);
  }

  calculateSkillGaps(progressData) {
    // Analyze progress data to identify skill gaps
    // This is a simplified implementation - would need more sophisticated logic in production
    const skills = [
      { name: 'Admin Foundation', level: 0 },
      { name: 'Security', level: 0 },
      { name: 'Flow Automation', level: 0 },
      { name: 'Apex', level: 0 },
      { name: 'LWC', level: 0 },
      { name: 'Integration', level: 0 },
      { name: 'DevOps', level: 0 }
    ];

    // Calculate skill levels based on completed modules
    if (progressData.completedTasks) {
      Object.keys(progressData.completedTasks).forEach(task => {
        if (task.includes('admin') && skills[0]) skills[0].level = Math.min(100, skills[0].level + 10);
        if (task.includes('security') && skills[1]) skills[1].level = Math.min(100, skills[1].level + 10);
        if (task.includes('flow') && skills[2]) skills[2].level = Math.min(100, skills[2].level + 10);
        if (task.includes('apex') && skills[3]) skills[3].level = Math.min(100, skills[3].level + 10);
        if (task.includes('lwc') && skills[4]) skills[4].level = Math.min(100, skills[4].level + 10);
        if (task.includes('integration') && skills[5]) skills[5].level = Math.min(100, skills[5].level + 10);
        if (task.includes('devops') && skills[6]) skills[6].level = Math.min(100, skills[6].level + 10);
      });
    }

    return skills;
  }

  calculateTimeSpent(progressData) {
    // Calculate time spent on different activities
    // This is a simplified implementation - would need more sophisticated logic in production
    return {
      learning: 25,
      practice: 35,
      review: 15,
      projects: 25
    };
  }

  updateSkillGaps(skills) {
    // Update the skill gap analysis section
    const skillGapsContainer = document.getElementById('skillGaps');
    skillGapsContainer.innerHTML = '';

    skills.forEach(skill => {
      const skillElement = document.createElement('div');
      skillElement.className = 'skill-gap-item';
      skillElement.innerHTML = `
        <div class="skill-name">${skill.name}</div>
        <div class="skill-bar-container">
          <div class="skill-bar" style="width: ${skill.level}%"></div>
        </div>
        <div class="skill-level">${skill.level}%</div>
      `;
      skillGapsContainer.appendChild(skillElement);
    });
  }

  setupEventListeners() {
    // Set up event listeners for interactive elements
    document.getElementById('refreshData').addEventListener('click', () => {
      this.loadLearningData();
    });

    document.getElementById('exportData').addEventListener('click', () => {
      this.exportAnalyticsData();
    });
  }

  exportAnalyticsData() {
    // Export analytics data as JSON or CSV
    const progressData = JSON.parse(localStorage.getItem('salesforceMasterDashboard.v1') || '{}');
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'salesforce-learning-analytics.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}

// Initialize the enhanced analytics when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('analyticsDashboard')) {
    new EnhancedAnalytics();
  }
});
