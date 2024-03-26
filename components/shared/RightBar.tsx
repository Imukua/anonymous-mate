import { fetchGroups } from "@/lib/actions/supportGroup.actions";
import UserCard from "../cards/UsersCard";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUsers } from "@/lib/actions/user.actions";
import SuggestionCard from "./SuggestionCard";

async function RightBar() {
    const user = await currentUser();
    if (!user) return null;

    const anonyMates = await fetchUsers({
        userId: user.id,
        pageSize: 4,
    });
    const suggestedGroups = await fetchGroups({
        searchString: "",
        pageNumber: 1,
        pageSize: 4,
        sortBy: "asc"
    });

    return (
        <section className="custom-scrollbar rightsidebar ">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading3-medium text-light-1">Suggested groups</h3>
                <div className='mt-7 flex w-[150px] flex-col gap-9'>
                    {suggestedGroups.groups.length > 0 ? (
                        <>
                            {suggestedGroups.groups.map((supportGroup) => (
                                <SuggestionCard
                                    key={supportGroup.id}
                                    id={supportGroup.id}
                                    name={supportGroup.name}
                                    username={supportGroup.username}
                                    imgUrl={supportGroup.picture}
                                    personType='group'
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>
                            No groups found
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading3-medium text-light-1">Suggested anonyMates</h3>
                <div className='mt-7 flex w-[180px] flex-col gap-10'>
                    {anonyMates.users.length > 0 ? (
                        <>
                            {anonyMates.users.map((person) => (
                                <SuggestionCard
                                    key={person.id}
                                    id={person.id}
                                    name={person.name}
                                    username={person.username}
                                    imgUrl={person.picture}
                                    personType='User'
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No mates yet</p>
                    )}
                </div>
            </div>
        </section >
    );
}

export default RightBar;
