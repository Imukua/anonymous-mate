import GroupProfile from "@/components/shared/GroupProfile";
import { Button } from "@/components/ui/button";
import { fetchGroupInfo } from "@/lib/actions/supportGroup.actions";
import { currentUser } from "@clerk/nextjs";
import JoinGroup from "@/components/forms/JoinGroup";
async function Page({
    groupId
}: { groupId: string }
) {

    const user = await currentUser();
    if (!user) return null;
    const groupInfo = await fetchGroupInfo(groupId);
    const gid = groupInfo.id;

    return (
        <section >
            <h1 className="text-light-1 head-text ">
                Join a group
            </h1>
            <GroupProfile
                groupId={groupId}
                authUserId={user.id}
                name={groupInfo.name}
                username={groupInfo.username}
                imgUrl={groupInfo.picture}
                bio={groupInfo.bio}
                showBtn={false}
            />

            <JoinGroup
                userId={user.id}
                groupId={gid}

            />

        </section>




    )
}

export default Page;