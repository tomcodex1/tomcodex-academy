// Peer Review System for Salesforce Learning Platform
class PeerReviewSystem {
  constructor() {
    this.initializeReviews();
    this.setupEventListeners();
  }

  initializeReviews() {
    // Load review data from localStorage or API
    this.reviews = this.loadReviews();
    this.currentUser = this.getCurrentUser();

    // Display reviews
    this.displayReviews();

    // Display user's reviews
    this.displayUserReviews();

    // Display review requests
    this.displayReviewRequests();
  }

  loadReviews() {
    const savedReviews = localStorage.getItem('tomcodex.peerReviews');
    if (savedReviews) {
      return JSON.parse(savedReviews);
    }

    // Default reviews if none exist
    return [
      {
        id: 'review-1',
        title: 'Salesforce Security Implementation',
        description: 'Review of my security implementation for a customer portal',
        author: 'Security Learner',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        reviewers: ['Expert Admin', 'Security Specialist'],
        submissions: [
          {
            id: 'submission-1',
            content: 'I have implemented a security model with profiles, permission sets, and sharing rules. Please review my approach.',
            code: 'Profile: Customer Portal User\nPermission Set: Portal Access\nSharing Rule: Account sharing',
            submittedAt: new Date(Date.now() - 3600000).toISOString(),
            type: 'configuration'
          }
        ]
      },
      {
        id: 'review-2',
        title: 'Apex Trigger for Lead Assignment',
        description: 'Review of my trigger for lead assignment based on territory',
        author: 'Apex Developer',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        reviewers: ['Code Reviewer', 'Apex Expert'],
        submissions: [
          {
            id: 'submission-1',
            content: 'I created a trigger to assign leads based on territory. Please review my implementation.',
            code: 'trigger LeadAssignment on Lead (before insert, before update) {\n // Lead assignment logic here\n}',
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
            type: 'code'
          }
        ],
        feedback: [
          {
            reviewer: 'Code Reviewer',
            comment: 'Good use of bulkification pattern. Consider adding test coverage for edge cases.',
            rating: 4,
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      },
      {
        id: 'review-3',
        title: 'Flow for Case Escalation',
        description: 'Review of my case escalation flow',
        author: 'Flow Builder',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        reviewers: ['Flow Expert'],
        submissions: [
          {
            id: 'submission-1',
            content: 'I created a flow to escalate cases based on priority and age.',
            code: 'Flow: Case Escalation\n- Decision: Case Priority\n- Action: Escalate to Manager',
            submittedAt: new Date(Date.now() - 1800000).toISOString(),
            type: 'automation'
          }
        ],
        feedback: [
          {
            reviewer: 'Flow Expert',
            comment: 'Good start. Consider adding a scheduled path for regular escalation checks.',
            rating: 3,
            createdAt: new Date(Date.now() - 900000).toISOString()
          }
        ]
      }
    ];
  }

  getCurrentUser() {
    // In a real implementation, this would come from authentication system
    return {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: 'Current User',
      avatar: '👤',
      expertise: ['administration', 'apex']
    };
  }

  displayReviews() {
    const reviewsContainer = document.getElementById('availableReviews');
    if (!reviewsContainer) return;

    const pendingReviews = this.reviews.filter(review => review.status === 'pending');

    if (pendingReviews.length === 0) {
      reviewsContainer.innerHTML = '<p>No reviews available at the moment.</p>';
      return;
    }

    reviewsContainer.innerHTML = '';

    pendingReviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card';
      reviewCard.innerHTML = `
        <div class="review-header">
          <div class="review-icon">${this.getReviewIcon(review.submissions[0].type)}</div>
          <div class="review-info">
            <h3 class="review-title">${review.title}</h3>
            <p class="review-description">${review.description}</p>
          </div>
        </div>
        <div class="review-meta">
          <span class="review-author">by ${review.author}</span>
          <span class="review-time">${this.formatTimeAgo(review.createdAt)}</span>
          <span class="review-status status-${review.status}">${review.status}</span>
        </div>
        <div class="review-actions">
          <button class="btn-primary review-submission" data-review-id="${review.id}">Review Submission</button>
        </div>
      `;

      reviewsContainer.appendChild(reviewCard);
    });
  }

  displayUserReviews() {
    const userReviewsContainer = document.getElementById('userReviews');
    if (!userReviewsContainer) return;

    const userReviews = this.reviews.filter(review => review.author === this.currentUser.name);

    if (userReviews.length === 0) {
      userReviewsContainer.innerHTML = '<p>You haven\'t submitted any reviews yet.</p>';
      return;
    }

    userReviewsContainer.innerHTML = '';

    userReviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'user-review-card';
      reviewCard.innerHTML = `
        <div class="review-header">
          <div class="review-icon">${this.getReviewIcon(review.submissions[0].type)}</div>
          <div class="review-info">
            <h3 class="review-title">${review.title}</h3>
            <p class="review-description">${review.description}</p>
          </div>
        </div>
        <div class="review-meta">
          <span class="review-status status-${review.status}">${review.status}</span>
          <span class="review-time">Submitted ${this.formatTimeAgo(review.createdAt)}</span>
        </div>
        <div class="review-actions">
          <button class="btn-outline view-feedback" data-review-id="${review.id}">View Feedback</button>
        </div>
      `;

      userReviewsContainer.appendChild(reviewCard);
    });
  }

  displayReviewRequests() {
    const requestsContainer = document.getElementById('reviewRequests');
    if (!requestsContainer) return;

    // In a real implementation, this would filter for reviews assigned to the current user
    const assignedReviews = this.reviews.slice(0, 2); // Demo: show first 2 reviews

    if (assignedReviews.length === 0) {
      requestsContainer.innerHTML = '<p>No review requests assigned to you.</p>';
      return;
    }

    requestsContainer.innerHTML = '';

    assignedReviews.forEach(review => {
      const requestCard = document.createElement('div');
      requestCard.className = 'request-card';
      requestCard.innerHTML = `
        <div class="request-header">
          <div class="request-icon">${this.getReviewIcon(review.submissions[0].type)}</div>
          <div class="request-info">
            <h3 class="request-title">${review.title}</h3>
            <p class="request-description">${review.description}</p>
          </div>
        </div>
        <div class="request-meta">
          <span class="request-author">by ${review.author}</span>
          <span class="request-time">${this.formatTimeAgo(review.createdAt)}</span>
        </div>
        <div class="request-actions">
          <button class="btn-primary provide-feedback" data-review-id="${review.id}">Provide Feedback</button>
        </div>
      `;

      requestsContainer.appendChild(requestCard);
    });
  }

  getReviewIcon(type) {
    if (type === 'code') return '⚡';
    if (type === 'configuration') return '⚙️';
    if (type === 'automation') return '🔄';
    return '📝';
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
    // Handle review submission buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('review-submission')) {
        const reviewId = e.target.getAttribute('data-review-id');
        this.reviewSubmission(reviewId);
      }

      if (e.target.classList.contains('provide-feedback')) {
        const reviewId = e.target.getAttribute('data-review-id');
        this.provideFeedback(reviewId);
      }

      if (e.target.classList.contains('view-feedback')) {
        const reviewId = e.target.getAttribute('data-review-id');
        this.viewFeedback(reviewId);
      }

      if (e.target.classList.contains('submit-review')) {
        const reviewId = e.target.getAttribute('data-review-id');
        this.submitReview(reviewId);
      }
    });
  }

  reviewSubmission(reviewId) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) return;

    // Show review modal
    const reviewModal = document.getElementById('reviewSubmissionModal');
    if (reviewModal) {
      reviewModal.classList.add('active');

      // Populate review content
      const submission = review.submissions[0];
      document.getElementById('reviewTitle').textContent = review.title;
      document.getElementById('reviewContent').value = submission.content;
      document.getElementById('reviewCode').value = submission.code;
      document.getElementById('reviewId').value = reviewId;
    }
  }

  provideFeedback(reviewId) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) return;

    // Show feedback modal
    const feedbackModal = document.getElementById('provideFeedbackModal');
    if (feedbackModal) {
      feedbackModal.classList.add('active');

      // Populate feedback form
      document.getElementById('feedbackReviewId').value = reviewId;
    }
  }

  viewFeedback(reviewId) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review || !review.feedback || review.feedback.length === 0) {
      this.showNotification('No feedback available yet.', 'info');
      return;
    }

    // Show feedback modal
    const feedbackModal = document.getElementById('viewFeedbackModal');
    if (feedbackModal) {
      feedbackModal.classList.add('active');

      // Display feedback
      const feedbackList = document.getElementById('feedbackList');
      feedbackList.innerHTML = '';

      review.feedback.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
          <div class="feedback-header">
            <span class="feedback-reviewer">${feedback.reviewer}</span>
            <div class="feedback-rating">
              ${this.renderStarRating(feedback.rating)}
            </div>
          </div>
          <div class="feedback-comment">${feedback.comment}</div>
          <div class="feedback-time">${this.formatTimeAgo(feedback.createdAt)}</div>
        `;

        feedbackList.appendChild(feedbackItem);
      });
    }
  }

  submitReview(reviewId) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) return;

    // Get feedback from form
    const comment = document.getElementById('feedbackComment').value;
    const rating = parseInt(document.getElementById('feedbackRating').value);

    if (!comment || !rating) {
      this.showNotification('Please provide both a comment and rating.', 'error');
      return;
    }

    // Add feedback to review
    if (!review.feedback) review.feedback = [];
    review.feedback.push({
      reviewer: this.currentUser.name,
      comment,
      rating,
      createdAt: new Date().toISOString()
    });

    // Update review status
    review.status = 'completed';

    // Save reviews
    this.saveReviews();

    // Update displays
    this.displayReviews();
    this.displayUserReviews();
    this.displayReviewRequests();

    // Close modal
    document.getElementById('provideFeedbackModal').classList.remove('active');

    // Show notification
    this.showNotification('Thank you for your feedback!');
  }

  renderStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
    }
    return stars;
  }

  saveReviews() {
    localStorage.setItem('tomcodex.peerReviews', JSON.stringify(this.reviews));
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

  // Create a new review request
  createReviewRequest(title, description, submission, type) {
    const newReview = {
      id: 'review-' + Math.random().toString(36).substr(2, 9),
      title,
      description,
      author: this.currentUser.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      reviewers: ['Expert 1', 'Expert 2'],
      submissions: [
        {
          id: 'submission-1',
          content: submission.content,
          code: submission.code,
          submittedAt: new Date().toISOString(),
          type
        }
      ]
    };

    this.reviews.unshift(newReview);
    this.saveReviews();

    // Update displays
    this.displayReviews();
    this.displayUserReviews();

    return newReview;
  }
}

// Initialize peer review system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('peerReviewContainer')) {
    new PeerReviewSystem();
  }
});

// Expose to global scope for other scripts
window.PeerReviewSystem = PeerReviewSystem;
