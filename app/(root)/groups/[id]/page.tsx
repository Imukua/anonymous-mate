import { currentUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupTabs } from "@/constants";
import Image from "next/image";
import PostsTab from "@/components/shared/PostsTab";
import { fetchGroupInfo } from "@/lib/actions/supportGroup.actions";
import GroupProfile from "@/components/shared/GroupProfile";

async function Page({ params }: { params: { id: string } }) {

    const user = await currentUser();
    if (!user) return null;

    const groupInfo = await fetchGroupInfo(params.id);


    return (
        <section>
            <GroupProfile
                accountId={groupInfo.id}
                authUserId={user.id}
                name={groupInfo.name}
                username={groupInfo.username}
                imgUrl={groupInfo.picture}
                bio={groupInfo.bio}
                type="supportGroup"
            />
            <div className='mt-3'>
                <Tabs defaultValue='posts' className='w-full'>
                    <TabsList className='tab'>
                        {groupTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === "Posts" && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {groupInfo.posts?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {groupTabs.map((tab) => (
                        <TabsContent
                            key={`content-${tab.label}`}
                            value={tab.value}
                            className='w-full text-light-1'
                        >
                            {/* @ts-ignore */}
                            <PostsTab
                                currentUserId={user.id}
                                accountId={groupInfo._id}
                                accountType='SupportGroup'
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}

export default Page;