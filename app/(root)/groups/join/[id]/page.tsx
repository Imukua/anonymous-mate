import JoinGroup from "@/components/forms/JoinGroup";
import { fetchGroupInfo } from "@/lib/actions/supportGroup.actions";
import { fetchMembership } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

async function Page({ params }: { params: { id: string } }) {

    const user = await currentUser();
    if (!user) return null;
    const membership = await fetchMembership({ authUserId: user.id, groupId: params.id });
    const groupInfo = await fetchGroupInfo(params.id);
    return (
        <>


            <div className="w-full h-[80vh]  rounded-lg bg-black border-gray-700">
                <div className="flex justify-center  mb-20">
                    <h1 className="head-text">{groupInfo.name} Rules</h1>
                </div>
                <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={groupInfo.picture} alt="Bonnie image" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">@{groupInfo.username}</span>
                    <div className="flex mt-4 md:mt-6">
                        <JoinGroup
                            userId={user.id}
                            groupId={params.id}
                            isMember={membership}
                        />
                    </div>
                </div>
                <div className=" p-4 bg-black rounded-lg md:p-8 dark:bg-gray-800" >
                    <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-white text-3xl font-extrabold">{groupInfo.members.length}+</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Members</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-white text-3xl font-extrabold">{groupInfo.posts.length}+</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Advices</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className=" text-white mb-2 text-3xl font-extrabold">18+</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Age Limit</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-white text-3xl font-extrabold">No</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Spamming</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-rose-300 text-3xl font-extrabold">No</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Soliciting</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2  text-white text-3xl font-extrabold">No</dt>
                            <dd className="text-gray-500 dark:text-gray-400">Identity</dd>
                        </div>
                    </dl>
                </div>
            </div>


        </>
    )
}

export default Page;