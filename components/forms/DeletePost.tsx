"use client";

import { deletePost } from "@/lib/actions/post.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner"


interface Props {
    postId: string;
    currentUserId: string;
    authorId: string;
    parentId: string | null;
    isComment?: boolean;
}

function DeletePost({
    postId,
    currentUserId,
    authorId,
    parentId,
    isComment,
}: Props) {
    const pathname = usePathname();
    const router = useRouter();

    if (currentUserId !== authorId) {

        return null;
    }

    return (
        <Image
            src='/assets/delete.svg'
            alt='delte'
            width={18}
            height={18}
            className='cursor-pointer object-contain'
            onClick={async () => {

                await deletePost(JSON.parse(postId), pathname);
                toast("Post deletion", {
                    className: ' text-light-1 font-bold text-lg px-2 py-2 rounded-lg',
                    description: "Post deleted successfully",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                })

            }}
        />

    );
}

export default DeletePost;