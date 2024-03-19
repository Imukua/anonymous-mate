"use server";

import User from "../models/user.model";
import supportGroup from "../models/support.group.model";
import { connectTodb } from "../mongoDB";
import { revalidatePath } from "next/cache";
import Post from "../models/post.model";

interface postProps {
    author: string;
    content: string;
    groupId: null;
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
            group: null,
        });

        //proceed to update user model
        await User.findByIdAndUpdate(author, {
            $push: {
                posts: createdPost._id,
            },
        });
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
        //Add the comment thread's ID to the original thread's children array
        parentPost.children.push(savedComment._id);

        await parentPost.save();
        revalidatePath(path);

    } catch (error: any) {
        console.log(`Failed to add comment to post: ${error}`)
    }
}