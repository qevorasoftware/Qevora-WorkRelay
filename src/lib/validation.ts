import { z } from 'zod'

export const requestSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Describe what you need (min 10 characters)'),
  projectId: z.string().min(1, 'Select a project'),
  assigneeId: z.string().min(1, 'Select an owner'),
  dueDate: z.string().min(1, 'Pick a due date'),
  visibility: z.enum(['client', 'internal']),
})

export type RequestInput = z.infer<typeof requestSchema>
