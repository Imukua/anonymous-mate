import CreatePost from "@/components/forms/CreatePost";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page(
    { searchParams, }: { searchParams: { [key: string]: string | undefined } }) {
    const user = await currentUser();
    if (!user) return null;
    console.log(searchParams?.gid);


    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");




    return (
        <>
            <h1 className="head-text">Create {searchParams?.gid ? "group" : "no"} post </h1>
            <CreatePost
                userId={userInfo._id}
                groupId={searchParams?.gid || null}
            />
        </>
    );
}


export default Page;