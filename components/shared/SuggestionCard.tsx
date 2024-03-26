"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
}

function SuggestionCard({ id, name, username, imgUrl, personType }: Props) {
    const router = useRouter();

    const isGroup = personType === "group";

    return (
        <article className='user-card'>
            <Button
                onClick={() => {
                    if (isGroup) {
                        router.push(`/groups/${id}`);
                    } else {
                        router.push(`/profile/${id}`);
                    }
                }}
            >

                <div className="flex gap-2 items-center">
                    <div className=" relative h-12 w-12">
                        <Image
                            src={imgUrl}
                            alt='user_logo'
                            fill
                            className='rounded-full object-cover border border-rose-300'
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        <h1 className=' text-white'>{name.split(' ')[0]}</h1>
                        <p className='text-small-medium text-gray-1 '>@{username}</p>
                    </div>
                </div>



            </Button>
        </article>
    );
}

export default SuggestionCard;