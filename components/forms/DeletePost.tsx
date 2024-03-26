"use client";

import { deletePost } from "@/lib/actions/post.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"




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
        <>
            <AlertDialog >
                <AlertDialogTrigger>  <Image
                    src='/assets/delete.svg'
                    alt='delte'
                    width={18}
                    height={18}
                    className='cursor-pointer object-contain'
                />
                </AlertDialogTrigger>
                <AlertDialogContent className=" w-18 rounded-lg  justify-center items-center  p-4 md:p-5 text-center">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-rose-300 ">Proceed to delete post?</AlertDialogTitle>
                        <AlertDialogDescription className=" !text-base-regular text-light-3 ">
                            This will permanently delete your post
                            and all its comments.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className=" w-18  px-2 py-2 text-sm font-medium text-gray-900 focus:outline-non rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-70 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 bg-gray-400">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="text-white bg-inherit  hover:bg-primary-500  focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-2 py-2 text-center "
                            onClick={async () => {

                                await deletePost(JSON.parse(postId), pathname);
                                toast("Post deletion", {
                                    className: ' text-light-1 font-bold text-lg px-2 py-2 rounded-lg bg-green-600',
                                    description: "Post deleted successfully",
                                    action: {
                                        label: "Undo",
                                        onClick: () => console.log("Undo"),
                                    },
                                })

                            }}
                        >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>



    );
}

export default DeletePost;