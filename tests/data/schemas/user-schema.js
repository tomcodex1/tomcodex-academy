import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['student', 'tutor']),
  enrolledAt: z.string(),
  enrollments: z.array(z.object({
    courseId: z.string(),
    enrolledAt: z.string()
  })).optional()
});

export const learningTrackSchema = z.object({
  track: z.string(),
  href: z.string(),
  total: z.number(),
  completed: z.number(),
  percent: z.number(),
  enrolled: z.boolean(),
  status: z.string(),
  action: z.string(),
  remaining: z.number()
});

export const learningProgressSchema = z.object({
  progress: z.number(),
  completed: z.number(),
  total: z.number()
});
