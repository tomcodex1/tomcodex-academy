// User Factory - Creates test user data
import { BaseFactory } from '../base-factory.js';
import { faker } from '@faker-js/faker';
import { userSchema, learningTrackSchema } from '../schemas/user-schema.js';

export class UserFactory extends BaseFactory {
  constructor() {
    super('user', {
      id: '',
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'student',
      enrolledAt: faker.date.past().toISOString(),
      enrollments: []
    });
  }

  // Create a tutor user
  asTutor() {
    return this.build({ role: 'tutor' });
  }

  // Create a user with specific enrollments
  withEnrollments(courseIds = []) {
    const enrollments = courseIds.map(courseId => ({
      courseId,
      enrolledAt: faker.date.past().toISOString()
    }));

    return this.build({ enrollments });
  }

  // Create a user with learning progress
  withLearningProgress(progressData = {}) {
    return this.build({ learningProgress: progressData });
  }

  // Create a user with specific tracks
  withLearningTracks(tracks = []) {
    const learningTracks = tracks.map(track => ({
      track: track.track,
      href: track.href,
      total: track.total,
      completed: track.completed,
      percent: track.percent,
      enrolled: track.enrolled,
      status: track.status,
      action: track.action,
      remaining: track.remaining
    }));

    return this.build({ learningTracks });
  }

  // Create a valid user with validation
  buildValid(attributes = {}) {
    return super.buildValid(attributes, userSchema);
  }

  // Create multiple valid users
  createValid(count = 1, attributes = {}) {
    const users = this.create(count, attributes);
    if (count === 1) {
      return this.buildValid(users);
    }

    return users.map(user => this.buildValid(user));
  }
}
