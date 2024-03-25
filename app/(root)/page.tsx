import Image from "next/image";
import { UserButton, currentUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "@/components/cards/PostCard";

export default async function Home() {
  const user = await currentUser();

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const res = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text text-left">SafeSpace</h1>
      <section className="mt-9 flex flex-col gap-10">
        {res?.posts.length === 0 ? (
          <p className="no-result">No posts found</p>
        ) : (
          <>
            {res?.posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.content}
                author={post.author}
                supportGroup={post.supportGroup}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes.length}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}