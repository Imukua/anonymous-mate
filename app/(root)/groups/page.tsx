import GroupCard from "@/components/cards/GroupCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchGroups } from "@/lib/actions/supportGroup.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import Pagination from "@/components/shared/Pagination";

async function Page(
    {
        searchParams,
    }: {
        searchParams: { [key: string]: string | undefined };
    }) {

    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const res = await fetchGroups({
        searchString: searchParams.q || '',
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25,
        sortBy: 'desc',
    });



    return (
        <>
            <h1 className='head-text mb-10'>Groups</h1>

            <div className='mt-5 flex flex-row justify-end items-center gap-5  '>
                <Searchbar routeType='groups' />

            </div>

            <section className='mt-9 flex flex-wrap gap-4'>
                {res.groups.length === 0 ? (
                    <p className='no-groups'>No Result</p>
                ) : (
                    <>
                        {res.groups.map((group) => (
                            <GroupCard
                                key={group.id}
                                id={group.id}
                                name={group.name}
                                username={group.username}
                                imgUrl={group.picture}
                                bio={group.bio}
                                members={group.members}
                            />
                        ))}
                    </>
                )}


            </section>
            <Pagination
                path='groups'
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={res.isNext}
            />


        </>
    );
}

export default Page;