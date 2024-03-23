"use client"
import { joinGroup, leaveGroup } from "@/lib/actions/supportGroup.actions";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

interface Params {
    userId: string;
    groupId: string;
    isMember?: boolean;
}


function JoinGroup({ userId, groupId, isMember }: Params) {
    const router = useRouter();

    const handleClick = async (uId: string, gId: string) => {
        console.log(gId);
        if (!isMember) {
            await joinGroup(
                {
                    authUserId: uId,
                    groupId: gId
                });
            router.push(`/groups/${groupId}`);
        } else {
            const onlyMember = await leaveGroup(
                {
                    authUserId: uId,
                    groupId: gId
                });

            if (onlyMember) {
                router.push('/groups');
            } else {
                router.push(`/groups/${groupId}`);
            }
        }
    }


    return (
        <div>
            <Button
                size='sm'
                className="bg-black text-white rounded-full  px-6 py-3"
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleClick(userId, groupId)}
            >{isMember ? "Leave" : "Join"}</Button>
        </div>
    )
}

export default JoinGroup;