"use client"
import { joinGroup } from "@/lib/actions/supportGroup.actions";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

interface Params {
    userId: string;
    groupId: string;
}


function JoinGroup({ userId, groupId }: Params) {
    const router = useRouter();

    const handleClick = async (uId: string, gId: string) => {
        console.log(gId);
        await joinGroup(
            {
                authUserId: uId,
                groupId: gId
            });
        router.push(`/groups/${groupId}`);
    }


    return (
        <div>
            <Button
                size='sm'
                className="bg-black text-white rounded-full  px-6 py-3"
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleClick(userId, groupId)}
            >Join</Button>
        </div>
    )
}

export default JoinGroup;