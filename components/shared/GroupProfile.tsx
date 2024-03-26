
"use client"
import { useState, useEffect } from 'react';
import { fetchMembership } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import JoinGroup from "../forms/JoinGroup";
import { auth } from "@clerk/nextjs";
import { Button } from "../ui/button";

interface profileProps {
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    type?: string;
    groupId?: string;
    showBtn?: boolean;
}

function GroupProfile({
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    groupId = "",
    showBtn = false,
}: profileProps) {
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        async function checkMembership() {
            if (groupId) {
                const member = await fetchMembership({
                    authUserId: authUserId,
                    groupId: groupId
                });
                console.log(" 1 >>>>>>>>>>>>>>>>>>>\n", member)



                setIsMember(member);



            }
        }

        checkMembership();
        console.log(" 1 g>>>>>>>>>>>>>>>>>>>\n", isMember)

    }, []);

    return (
        <div className='flex flex-col w-full   h-full  ' >
            <div className="relative  shadow-2xl md:h-40 h-20 w-full  border-l-2 border-rose-400 overflow-hidden">
                <Image
                    src={imgUrl}
                    fill
                    alt="Group-Profile-Picture"
                    className="object-cover"
                />
                <h1 className=' absolute left-0 bottom-0 text-left text-heading3-bold text-blue  rounded'>{name}</h1>
            </div>
            <div className=' items-center bg-neutral-700 bg-opacity-50 p-1 border-r-2 border-cyan-400 w-full flex flex-row justify-between '>
                <div>
                    <span className=" text-rose-300">@{username}</span>
                    <span className="block text-gray-500 text-sm w-60 md:w-full ">{bio}</span>
                </div>
                <div className="flex flex-col md:flex-row gap-2 ">
                    {isMember ? (
                        <Link href={`/create-post?gid=${groupId}`} >
                            <Button
                                size='sm'
                                className="bg-blue text-white  rounded-full  px-2 py-3 md:px-6 md:py-3 justify-between items-center gap-2">
                                <Image
                                    src={"/assets/create.svg"}
                                    width={20}
                                    height={20}
                                    alt="Group-Profile-Picture"
                                    className=" bg-black items-center"
                                />

                                <h2 className="text-white items-center ">post</h2>
                            </Button>
                        </Link>) : null}
                    <JoinGroup
                        userId={authUserId}
                        groupId={groupId}
                        isMember={isMember}
                    />
                </div>
            </div>
        </div >
    );

}

export default GroupProfile;