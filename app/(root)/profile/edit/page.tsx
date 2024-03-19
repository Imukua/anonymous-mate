import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";


async function Page() {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding")


    const userdata = {
        id: user.id,
        objectId: userInfo?._id,
        username: userInfo ? userInfo?.username : user.username,
        name: userInfo ? userInfo?.name : user.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.picture : user.imageUrl,

    }
    return (
        <>
            <h1 className="text-white font-extrabold text-xl">Edit your profile</h1>
            <p className="text-white mt-3 ">Finalise your registration</p>
            <section className="mt-12">
                <AccountProfile user={userdata} btnTitle="Proceed" />
            </section>

        </>
    )
}


export default Page;