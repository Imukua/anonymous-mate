
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
async function GroupProfile({
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    groupId = "",
    showBtn = true,

}: profileProps) {
    if (groupId) {
        const isMember = await fetchMembership({
            authUserId: authUserId,
            groupId: groupId
        });

        if (isMember) {
            showBtn = true;
        }

    }

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
                    <span className="block text-gray-500 text-sm">{bio}</span>
                </div>
                <div className="flex flex-row gap-2 ">
                    {showBtn ? (
                        <Link href={`/create-post?gid=${groupId}`} >
                            <Button
                                size='sm'
                                className="bg-black text-white rounded-full  px-6 py-3">
                                post
                            </Button>
                        </Link>) : null}
                    <JoinGroup
                        userId={authUserId}
                        groupId={groupId}
                        isMember={showBtn}
                    />
                </div>
            </div>
        </div >
    );

}

export default GroupProfile;