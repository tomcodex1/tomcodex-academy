// Learning Factory - Creates test learning data
import { BaseFactory } from '../base-factory.js';
import { faker } from '@faker-js/faker';
import { learningSchema, missionSchema, habitProgressSchema, todayProgressSchema, statsSchema } from '../schemas/learning-schema.js';

export class LearningFactory extends BaseFactory {
  constructor() {
    super('learning', {
      selectedDay: 1,
      activeTab: 'dashboard',
      completedTasks: {},
      completedHabits: [],
      generatedStages: [],
      userId: ''
    });
  }

  // Create learning state with specific progress
  withProgress(day, tasksCompleted = [], habitsCompleted = []) {
    const completedTasks = { [day]: tasksCompleted };
    const completedHabits = habitsCompleted;

    return this.build({
      selectedDay: day,
      completedTasks,
      completedHabits
    });
  }

  // Create learning state with generated stages
  withGeneratedStages(stages) {
    return this.build({
      generatedStages: stages
    });
  }

  // Create a learning state with specific active tab
  withActiveTab(tab) {
    return this.build({
      activeTab: tab
    });
  }

  // Create a mission object
  createMission(day, title, mustFinish = [], recall = []) {
    return {
      day,
      title,
      trainerNote: `Focus on ${title}. Learn the concepts, complete the hands-on task, and explain the result without reading notes.`,
      mustFinish,
      recall
    };
  }

  // Create habit progress
  createHabitProgress(completed = 0, total = 10) {
    const progress = Math.round((completed / total) * 100) || 0;
    return {
      progress,
      completed,
      total
    };
  }

  // Create today's progress
  createTodayProgress(completed = 0, total = 5) {
    const progress = Math.round((completed / total) * 100) || 0;
    return {
      progress,
      completed,
      total
    };
  }

  // Create stats array
  createStats(currentStage = 1, currentTitle = 'Org Navigation') {
    return [
      { label: "Pathways", value: "24+", detail: "Continuously expanding" },
      { label: "Access", value: "Unlimited", detail: "No fixed day limit" },
      { label: "Current", value: `Stage ${currentStage}`, detail: currentTitle },
      { label: "Growth", value: "Career-long", detail: "Before and after placement" }
    ];
  }

  // Create a valid learning state with validation
  buildValid(attributes = {}) {
    return super.buildValid(attributes, learningSchema);
  }

  // Create multiple valid learning states
  createValid(count = 1, attributes = {}) {
    const states = this.create(count, attributes);
    if (count === 1) {
      return this.buildValid(states);
    }

    return states.map(state => this.buildValid(state));
  }
}
