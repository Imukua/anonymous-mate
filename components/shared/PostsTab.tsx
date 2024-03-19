import { redirect } from "next/navigation";

import { fetchUserPosts } from "@/lib/actions/user.actions";

import PostCard from "../cards/PostCard";
import { fetchGroupPosts } from "@/lib/actions/supportGroup.actions";

interface Result {
    name: string;
    picture: string;
    id: string;
    posts: {
        _id: string;
        content: string;
        parentId: string | null;
        author: {
            name: string;
            picture: string;
            id: string;
        };
        supportGroup: {
            id: string;
            name: string;
            picture: string;
        } | null;
        createdAt: string;
        children: {
            author: {
                picture: string;
            };
        }[];
    }[];
}

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

async function PostsTab({ currentUserId, accountId, accountType }: Props) {
    let result: Result;

    if (accountType === "SupportGroup") {
        result = await fetchGroupPosts(accountId);
    } else {
        result = await fetchUserPosts(accountId);
    }

    if (!result) {
        redirect("/");
    }

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.posts.map((post) => (
                <PostCard
                    key={post._id}
                    id={post._id}
                    currentUserId={currentUserId}
                    parentId={post.parentId}
                    content={post.content}
                    author={
                        accountType === "User"
                            ? { name: result.name, picture: result.picture, id: result.id }
                            : {
                                name: post.author.name,
                                picture: post.author.picture,
                                id: post.author.id,
                            }
                    }
                    supportGroup={
                        accountType === "SupportGroup"
                            ? { name: result.name, id: result.id, picture: result.picture }
                            : post.supportGroup
                    }
                    createdAt={post.createdAt}
                    comments={post.children}
                />
            ))}
        </section>
    );
}

export default PostsTab;