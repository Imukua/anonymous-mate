import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import DeletePost from "../forms/DeletePost";
import ReactionsTab from "../shared/ReactionsBar";

interface cardParams {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        picture: string;
        id: string;
    };
    supportGroup: {
        id: string;
        name: string;
        picture: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            picture: string;
        };
    }[];
    isComment?: boolean;
    likes: number;
}

async function PostCard({
    id,
    currentUserId,
    parentId,
    content,
    author,
    supportGroup,
    createdAt,
    comments,
    isComment,
    likes,
}: cardParams) {

    return (
        <article
            className={`flex w-full flex-col rounded-xl  ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
                }`}
        >
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
                            <Image
                                src={author.picture}
                                alt='user_group_image'
                                fill
                                className='cursor-pointer rounded-full'
                            />
                        </Link>

                        <div className='thread-card_bar' />
                    </div>

                    <div className='flex w-full flex-col  '>
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {author.name}
                            </h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-light-2   '>{content}</p>
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
                                <Link href={`/post/${id}`}>
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




                    </div>
                </div>
                <DeletePost
                    postId={JSON.stringify(id)}
                    currentUserId={currentUserId}
                    authorId={author.id}
                    parentId={parentId}
                    isComment={isComment}
                />


            </div>

            {!isComment && comments.length > 0 && (
                <div className='ml-1 mt-3 flex items-center gap-2'>
                    {comments.slice(0, 2).map((comment, index) => (
                        <Image
                            key={index}
                            src={comment.author.picture}
                            alt={`user_${index}`}
                            width={24}
                            height={24}
                            className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                        />
                    ))}

                    <Link href={`/post/${id}`}>
                        <p className="mt-1 text-subtle-medium text-gray-1">
                            {comments.length} advice{comments.length > 1 ? "es" : ""}
                        </p>
                    </Link>
                </div>
            )}
            {!isComment && supportGroup && (
                <Link
                    href={`/groups/${supportGroup.id}`}
                    className='mt-5 flex items-center'
                >
                    <p className='text-subtle-medium text-gray-1'>
                        {formatDateString(createdAt)}
                        {supportGroup && ` - ${supportGroup.name} supportGroup`}
                    </p>

                    <Image
                        src={supportGroup.picture}
                        alt={supportGroup.name}
                        width={14}
                        height={14}
                        className='ml-1 rounded-full object-cover'
                    />
                </Link>
            )}


        </article>
    );
}

export default PostCard;