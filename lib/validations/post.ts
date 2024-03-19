import * as z from 'zod';

export const postValidation = z.object({
    post: z.string().min(2, {
        message:
            'A minimum of 2 characters please '
    }).nonempty({
        message:
            'This field is required'
    }),
    accountId: z.string(),
})
export const commentValidation = z.object({
    post: z.string().min(2, {
        message:
            'A minimum of 2 characters please '
    }).nonempty({
        message:
            'This field is required'
    }),
});
