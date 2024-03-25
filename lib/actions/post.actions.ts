"use server";

import User from "../models/user.model";
import supportGroup from "../models/support.group.model";
import { connectTodb } from "../mongoDB";
import { revalidatePath } from "next/cache";
import Post from "../models/post.model";
import SupportGroup from "../models/support.group.model";

interface postProps {
    author: string;
    content: string;
    groupId: string | null;
    path: string;
}

export async function createPost({
    author,
    content,
    groupId,
    path
}: postProps): Promise<void> {
    try {
        connectTodb();
        const createdPost = await Post.create({
            author,
            content,
            group: groupId,
        });

        //proceed to update user model
        await User.findByIdAndUpdate(author, {
            $push: {
                posts: createdPost._id,
            },
        });

        //proceed to update group model
        if (groupId) {
            const groupObjId = await supportGroup.findOne(
                { id: groupId },
                { _id: 1 }
            );
            if (groupObjId) {
                await SupportGroup.findByIdAndUpdate(groupObjId, {
                    $push: { posts: createdPost._id },
                });
            }
        }
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating post: ${error}`)
    }
}

export async function fetchPosts(pageNum = 1, pageSize = 20) {
    try {
        connectTodb();
        const skip = (pageNum - 1) * pageSize;

        //lets firsts get posts that arent comments
        //then populate their comments

        const postQuery = Post.find({
            parentId: { $in: [null, undefined] }
        })
            .sort({
                createdAt: 'desc'
            })
            .skip(skip)
            .limit(pageSize)
            .populate({
                path: 'author',
                model: 'User'
            })
            .populate({
                path: 'supportGroup',
                model: 'SupportGroup'
            })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: '_id username picture'

                }
            });

        //count the total number of posts for pagination
        const totalPosts = await Post.countDocuments({
            parentId: { $in: [null, undefined] }
        });

        const posts = await postQuery.exec();
        const isNext = totalPosts > skip + posts.length
        return {
            posts,
            isNext
        }

    } catch (error: any) {
        console.log(`Failed to fetch postsbn: ${error}`)
    }

}

export async function fetchPostbyId(postId: string) {
    try {
        connectTodb();
        const post = await Post.findById(postId)
            .populate({
                path: 'author',
                model: User,
                select: '_id username picture'
            })
            .populate({
                path: 'supportGroup',
                model: supportGroup,
                select: '_id name picture'
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id username parentId picture",
                    },
                    {
                        path: "children",
                        model: Post,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id username parentId picture",
                        },
                    },
                ],
            })
            .exec();

        return post;
    } catch (error: any) {
        console.log(`Failed to fetch post by ID: ${error}`)
    }
}

export async function addCommentToPost(
    postId: string,
    path: string,
    content: string,
    userId: string,
) {
    connectTodb();
    try {
        const parentPost = await Post.findById(postId);
        if (!parentPost) {
            throw new Error("Parent-post not found");
        }


        const newComment = new Post({
            content: content,
            author: userId,
            parentId: postId,
        });

        const savedComment = await newComment.save();
        //Add the comment Post's ID to the original Post's children array
        parentPost.children.push(savedComment._id);

        await parentPost.save();
        revalidatePath(path);

    } catch (error: any) {
        console.log(`Failed to add comment to post: ${error}`)
    }
}

async function fetchAllComments(postId: string): Promise<any[]> {
    const comments = await Post.find({ parentId: postId });

    const descendantComments = [];
    for (const comment of comments) {
        const descendants = await fetchAllComments(comment._id);
        descendantComments.push(comment, ...descendants);
    }

    return descendantComments;
}

export async function deletePost(id: string, path: string): Promise<void> {
    try {
        connectTodb();

        // fetch the Post to be deleted 
        const mainPost = await Post.findById(id).populate("author supportGroup");

        if (!mainPost) {
            throw new Error("Post not found");
        }

        // Fetch all comments and their descendants recursively
        const descendantPosts = await fetchAllComments(id);

        // Get all descendant Post IDs including the main Post ID and child Post IDs
        const descendantPostIds = [
            id,
            ...descendantPosts.map((post) => post._id),
        ];

        // Extract the authorIds and GroupIds to update User and group models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendantPosts.map((post) => post.author?._id?.toString()),
                mainPost.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        const uniqueGroupIds = new Set(
            [
                ...descendantPosts.map((post) => post.group?._id?.toString()),
                mainPost.group?._id?.toString(),
            ].filter((id) => id !== undefined)
        );
        console.log(uniqueAuthorIds)

        // Recursively delete child Posts and their descendants
        await Post.deleteMany({ _id: { $in: descendantPostIds } });

        // Update User model with deleted posts/comments
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull: { posts: { $in: descendantPostIds } } }
        );

        // Update supportGroup  model  with deleted posts/comments
        await SupportGroup.updateMany(
            { _id: { $in: Array.from(uniqueGroupIds) } },
            { $pull: { posts: { $in: descendantPostIds } } }
        );

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete Post: ${error.message}`);
    }
}