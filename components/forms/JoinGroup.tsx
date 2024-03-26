"use client"
import { joinGroup, leaveGroup } from "@/lib/actions/supportGroup.actions";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

interface Params {
    userId: string;
    groupId: string;
    isMember: boolean;
}


function JoinGroup({ userId, groupId, isMember }: Params) {
    const router = useRouter();
    const path = usePathname();

    return (
        <>
            <Button
                size='sm'
                className="bg-black text-white rounded-full  px-6 py-3"
                onClick={async () => {
                    try {
                        if (!isMember) {
                            await joinGroup(
                                {
                                    authUserId: userId,
                                    groupId: groupId
                                });
                            router.push(`/groups/${groupId}`);
                        } else {
                            const onlyMember = await leaveGroup(
                                {
                                    authUserId: userId,
                                    groupId: groupId
                                });

                            if (onlyMember) {
                                router.push('/groups');
                            } else {
                                router.push(`/groups/${groupId}`);
                            }
                        }
                    } catch (e) {
                        router.push('/groups');

                    }
                }

                }
            >{isMember ? "Leave" : "Join"}</Button >
        </>
    )
}

export default JoinGroup;