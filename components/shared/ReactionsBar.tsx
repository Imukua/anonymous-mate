"use client"
import { likeStatus, updateLike } from "@/lib/actions/post.actions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


function ReactionsTab({ postId, isComment, userId, likes }:
    { postId: string, isComment?: boolean, userId: string, likes: number, isLiked: boolean }) {


    const [isLiked1, setIsLiked] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(likes);


    useEffect(() => {
        const fetchIsLiked = async () => {
            const result = await likeStatus(postId, userId);
            setIsLiked(result.status);
            setLikesCount(result.likesCount);
        };
        fetchIsLiked();
    }, []);

    const handleLike = async () => {
        console.log('like')
        const result = await updateLike(postId, userId);
        setIsLiked(!isLiked1);
        setLikesCount(isLiked1 ? likesCount - 1 : likesCount + 1);

    }

    return (
        <>
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                <div className='flex gap-10'>
                    <div className="flex flex-row items-center gap-2">
                        <a onClick={handleLike}>
                            <Image
                                src={isLiked1 ? '/assets/liked.svg' : '/assets/like.svg'}
                                alt='like'
                                width={24}
                                height={24}
                                className='cursor-pointer object-contain'
                            />

                        </a>
                        <span className=" text-subtle-medium text-gray-1">{likesCount}</span>

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