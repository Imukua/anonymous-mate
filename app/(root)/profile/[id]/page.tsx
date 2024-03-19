import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";


async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;


    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <section>
            {/*Profile header component*/}

            <div className="mt-9">


            </div>

        </section>
    )



}

export default Page;