"use client";

import { addCommentToPost } from "@/lib/actions/post.actions";
import { commentValidation } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";


interface Props {
    postId: string;
    currentUserimg: string;
    currentUserid: string;
}
function CommentForm({ postId, currentUserimg, currentUserid }: Props) {
    const pathname = usePathname();

    const form = useForm<z.infer<typeof commentValidation>>({
        resolver: zodResolver(commentValidation),
        defaultValues: {
            post: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof commentValidation>) => {
        await addCommentToPost(
            postId,
            pathname,
            values.post,
            JSON.parse(currentUserid),
        );
        form.reset();
    }
    return (
        <Form {...form}>
            <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='post'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserimg}
                                    alt='current_user'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    {...field}
                                    placeholder='talk it out ...'
                                    className='no-focus text-light-1 outline-none'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='comment-form_btn'>
                    reply
                </Button>
            </form>
        </Form>
    );
}

export default CommentForm;