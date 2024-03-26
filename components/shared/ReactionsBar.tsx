"use client"
import { likeStatus, updateLike } from "@/lib/actions/post.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, } from "next/navigation";
import { useEffect, useState } from "react";


function ReactionsTab({ postId, isComment, }:
    { postId: string, isComment?: boolean, userId: string, likes: number }) {





    const path = usePathname();
    const router = useRouter();



    return (
        <>
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                <div className='flex gap-10'>
                    <div className="flex flex-row items-center gap-2">
                        <Image
                            src={'/assets/like.svg'}
                            alt='like'
                            width={24}
                            height={24}
                            className='cursor-pointer object-contain'
                        />

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