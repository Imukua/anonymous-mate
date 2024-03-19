import * as z from 'zod';

export const userValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().max(38).min(3),
    bio: z.string().max(1000).min(4),
    username: z.string().max(10).min(4)
})