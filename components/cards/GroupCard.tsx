import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    members: {
        picture: string;
    }[];
}

function GroupCard({ id, name, username, imgUrl, bio, members }: Props) {
    return (
        <article className='group-card'>
            <div className='flex flex-wrap items-center gap-5'>
                <Link href={`/groups/${id}`} className='relative h-12 w-12'>
                    <Image
                        src={imgUrl}
                        alt='group_logo'
                        fill
                        className='rounded-full object-cover'
                    />
                </Link>

                <div>
                    <Link href={`/groups/${id}`}>
                        <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    </Link>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>

            <p className='mt-4 text-subtle-medium text-gray-1'>{bio}</p>

            <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
                <Link href={`/groups/${id}`}>
                    <Button size='sm' className='group-card_btn'>
                        View
                    </Button>
                </Link>

                {members.length > 0 && (
                    <div className='flex items-center'>
                        {members.map((member, index) => (
                            <Image
                                key={index}
                                src={member.picture}
                                alt={`user_${index}`}
                                width={28}
                                height={28}
                                className={`${index !== 0 && "-ml-2"
                                    } rounded-full object-cover`}
                            />
                        ))}
                        {members.length > 3 && (
                            <p className='ml-1 text-subtle-medium text-gray-1'>
                                {members.length}+ members
                            </p>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

export default GroupCard;