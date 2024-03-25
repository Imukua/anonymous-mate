"use client"
import { likeStatus, updateLike } from "@/lib/actions/post.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, } from "next/navigation";
import { useEffect, useState } from "react";


function ReactionsTab({ postId, isComment, userId, likes, isLiked }:
    { postId: string, isComment?: boolean, userId: string, likes: number, isLiked: boolean }) {





    const path = usePathname();
    const router = useRouter();
    console.log("liked: ", isLiked)

    const handleLike = async () => {
        const result = await updateLike(postId, userId);
        router.push(path)

    }

    return (
        <>
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                <div className='flex gap-10'>
                    <div className="flex flex-row items-center gap-2">
                        <a onClick={handleLike}>
                            <Image
                                src={isLiked ? '/assets/liked.svg' : '/assets/like.svg'}
                                alt='like'
                                width={24}
                                height={24}
                                className='cursor-pointer object-contain'
                            />

                        </a>
                        <span className=" text-subtle-medium text-gray-1">{likes}</span>

                    </div>
                    <Link href={`/post/${postId}`}>
                        <Image
                            src='/assets/reply.svg'
                            alt='reply'
                            width={24}
                            height={24}
                            className='cursor-pointer object-contain'
                        />
                    </Link>
                    <Image
                        src='/assets/repost.svg'
                        alt='repost'
                        width={24}
                        height={24}
                        className='cursor-pointer object-contain'
                    />
                    <Image
                        src='/assets/share.svg'
                        alt='share'
                        width={24}
                        height={24}
                        className='cursor-pointer object-contain'
                    />


                </div>
            </div>

        </>
    )
}


export default ReactionsTab;