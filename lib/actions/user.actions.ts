"use server";

import SupportGroup from "../models/support.group.model";
import { connectTodb } from "../mongoDB";
import { revalidatePath } from "next/cache";
import Post from "../models/post.model";
import mongoose, { FilterQuery, SortOrder } from "mongoose";
import User from "../models/user.model";
export async function fetchUser(userId: string) {
    try {
        connectTodb();
        const user = await User.findOne({ id: userId }).populate(
            {
                path: 'supportGroups',
                model: SupportGroup
            }
        )

        return user;
    } catch (error: any) {
        throw new Error(`failed to fetch user: ${error.message}`)

    }
}


interface userProps {
    userId: string;
    name: string;
    username: string;
    bio: string;
    picture: string;
    path: string;
}
export async function updateUser({
    userId,
    name,
    username,
    bio,
    picture,
    path
}: userProps): Promise<void> {
    try {
        connectTodb();
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                picture,
                onboarded: true
            },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`failed to create/update user : ${error.message}`);
    }
}



export async function fetchMembership({ authUserId, groupId }: { authUserId: string, groupId: string }) {
    try {
        connectTodb();
        const group_Id = new mongoose.Types.ObjectId(groupId);
        const user = await User.findOne({ id: authUserId });
        const usergroups = user.supportGroups;


        const isMember = usergroups.includes(group_Id);
        return isMember;

    } catch (error) {
        console.log("Error fetchng membership:", error);
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectTodb();

        // Find all Posts authored by the user with the given userId
        const posts = await User.findOne({ id: userId }).populate({
            path: "posts",
            model: Post,
            populate: [
                {
                    path: "supportGroup",
                    model: SupportGroup,
                    select: "name id picture _id", // Select the "name" and "_id" fields from the "group" model
                },
                {
                    path: "children",
                    model: Post,
                    populate: {
                        path: "author",
                        model: User,
                        select: "name picture id", // Select the "name" and "_id" fields from the "User" model
                    },
                },
            ],
        });
        return posts;

    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
}


interface UserParams {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize: number;
    sortBy?: SortOrder;
}
export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
}: UserParams) {
    const res = {};
    connectTodb();
    try {
        const skip = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");
        const sortOpt = { createdAt: sortBy };
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        };

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        const usersQuery = User.find(query).
            sort(sortOpt)
            .skip(skip)
            .limit(pageSize)

        const totalUsers = await User.countDocuments(query);
        const users = await usersQuery;
        const isNext = totalUsers > skip + users.length;
        return { users, isNext }

    } catch (error) {
        console.log("Error fetching users for search:", error);
        throw error;
    }

}


export async function getActivity(userId: string) {
    try {
        connectTodb();
        const userPosts = await Post.find({ author: userId });

        // Collect all the child Post ids (replies) from the 'children' field of each user Post
        const childPostIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.children);
        }, []);

        // Find and return the child Posts (replies) excluding the ones created by the same user
        const replies = await Post.find({
            _id: { $in: childPostIds },
            author: { $ne: userId }, // Exclude Posts authored by the same user
        }).populate({
            path: "author",
            model: User,
            select: "name picture _id",
        });

        return replies;

    } catch (error) {
        console.log("Error fetching user activity:", error);
    }

}

