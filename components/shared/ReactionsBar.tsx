"use client"
import Image from "next/image";
import Link from "next/link";




function ReactionsTab(postId: string) {
    function handleLike() {
        console.log('like')
    }
    return (
        <div className='flex gap-3.5'>
            <a onClick={handleLike}>
                <Image
                    src='/assets/like.svg'
                    alt='like'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                />
            </a>
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
    )
}

export default ReactionsTab;