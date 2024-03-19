import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";


async function Page() {
    const user = await currentUser();
    if (!user) return null; // to avoid typescript warnings

    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded) redirect("/");
    const userData = {
        id: user?.id,
        objectId: userInfo?.id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image: userInfo?.image || user?.imageUrl,
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20 ">
            <h1 className="head-text"> onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                {" "}Finalise registration to continue
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle="contine" />

            </section>
        </main>
    );
}

export default Page;