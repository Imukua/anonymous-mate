import { fetchGroupMembers } from "@/lib/actions/supportGroup.actions";
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UsersCard";
import { redirect } from "next/navigation";

interface Props {
    groupId: string;
}
async function MembersTab({ groupId }: Props) {

    const user = await currentUser();
    if (!user) return <h1 className="!text-base-regular text-light-3">member only zone !</h1>
    const result = await fetchGroupMembers(groupId);

    return (
        <section className='mt- flex flex-col gap-10 "bg-dark-2 p-7 rounded-xl'>
            {
                result.members.length > 0 ? (
                    <>
                        {result.members.map((member: any) => (
                            <UserCard
                                key={member.id}
                                id={member.id}
                                name={member.name}
                                username={member.username}
                                imgUrl={member.picture}
                                personType='User'
                            />
                        ))}
                    </>
                ) : (
                    <p className='!text-base-regular text-light-3'>No mates found</p>
                )
            }

        </section >
    )


}

export default MembersTab;