import { z } from "zod"

export const notificationSchema = z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    isRead: z.boolean(),
})

export type Notification = z.infer<typeof notificationSchema>