import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import CreateGroup from "@/components/forms/CreateGroup";


async function Page() {
    const user = await currentUser();
    if (!user) return null; // to avoid typescript warnings

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    const userData = {
        userId: userInfo?.id,
        name: userInfo?.name || user?.firstName || '',
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20 ">
            <h1 className="head-text"> Create Group</h1>
            <p className="mt-3 text-base-regular text-light-2">
                {" "}Support is one form away!
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <CreateGroup group={userData} btnTitle="contine" />

            </section>
        </main>
    );
}

export default Page;