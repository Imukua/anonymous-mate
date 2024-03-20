import PostCard from "@/components/cards/PostCard";
import CommentForm from "@/components/forms/CommentForm";
import { fetchPostbyId } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    const postThread = await fetchPostbyId(params.id)

    return (
        <section>
            <div>
                <PostCard
                    id={postThread._id}
                    currentUserId={user.id}
                    parentId={postThread.parentId}
                    author={postThread.author}
                    content={postThread.content}
                    createdAt={postThread.createdAt}
                    supportGroup={postThread.supportGroup}
                    comments={postThread.children}
                />
            </div>
            <div className='mt-7'>
                <CommentForm
                    postId={params.id}
                    currentUserimg={user.imageUrl}
                    currentUserid={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className='mt-10'>
                {postThread?.children?.map((childItem: any) => (
                    <PostCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user.id}
                        parentId={childItem.parentId}
                        content={childItem.content}
                        author={childItem.author}
                        supportGroup={childItem.supportGroup}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    );
}
export default page;