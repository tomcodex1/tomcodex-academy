import { z } from 'zod';

export const learningSchema = z.object({
  id: z.string(),
  selectedDay: z.number().min(1),
  activeTab: z.string(),
  completedTasks: z.record(z.array(z.number())),
  completedHabits: z.array(z.number()),
  generatedStages: z.array(z.array(z.any())),
  userId: z.string().optional()
});

export const learningDaySchema = z.object({
  day: z.number(),
  focus: z.string(),
  topics: z.string(),
  practice: z.string()
});

export const missionSchema = z.object({
  day: z.number(),
  title: z.string(),
  trainerNote: z.string(),
  mustFinish: z.array(z.string()),
  recall: z.array(z.string())
});

export const habitProgressSchema = z.object({
  progress: z.number(),
  completed: z.number(),
  total: z.number()
});

export const todayProgressSchema = z.object({
  progress: z.number(),
  completed: z.number(),
  total: z.number()
});

export const statsSchema = z.array(z.object({
  label: z.string(),
  value: z.string(),
  detail: z.string()
}));
