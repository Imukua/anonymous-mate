"use server";

import { FilterQuery, SortOrder } from "mongoose";
import SupportGroup from "../models/support.group.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import { connectTodb } from "../mongoDB";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";


export async function joinGroup(
    authUserId: string,
    groupId: string
) {
    try {
        connectTodb();

        // Find the group by its unique id
        const group = await SupportGroup.findOne({ id: groupId });

        if (!group) {
            throw new Error("group not found");
        }

        // Find the user by their unique id
        const user = await User.findOne({ id: authUserId });

        if (!user) {
            throw new Error("User not found");
        }

        // Check if the user is already a member of the group
        if (group.members.includes(user._id)) {
            throw new Error("User is already a member of the group");
        }

        // Add the user's _id to the members array in the group
        group.members.push(user._id);
        await group.save();

        // Add the group's _id to the communities array in the user
        user.supportGroups.push(group._id);
        await user.save();

        return group;
    } catch (error) {
        // Handle any errors
        console.error("Error adding member to group:", error);
        throw error;
    }
}
export async function fetchGroupPosts(id: string) {
    try {
        connectTodb();

        const SupportGroupPosts = await SupportGroup.findById(id).populate({
            path: "posts",
            model: Post,
            populate: [
                {
                    path: "author",
                    model: User,
                    select: "name picture id", // Select the "name" and "_id" fields from the "User" model
                },
                {
                    path: "posts",
                    model: Post,
                    populate: {
                        path: "author",
                        model: User,
                        select: "picture _id", // Select the "name" and "_id" fields from the "User" model
                    },
                },
            ],
        });

        return SupportGroupPosts;
    } catch (error) {
        // Handle any errors
        console.error("Error fetching group posts:", error);
        throw error;
    }
}

export async function fetchGroups({
    searchString,
    pageNumber,
    pageSize,
    sortBy = 'desc',
}: {
    searchString: string;
    pageNumber: number;
    pageSize: number;
    sortBy: SortOrder;
}) {
    try {
        connectTodb();
        const skip = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof SupportGroup> = {}

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }
        const totalGroups = await SupportGroup.countDocuments(query);

        const sortOpt = { createdBy: sortBy };

        const groupQuery = SupportGroup.find(query)
            .sort(sortOpt)
            .skip(skip)
            .limit(pageSize)
            .populate('members')

        const groups = await groupQuery.exec();
        const isNext = totalGroups > skip + groups.length;

        return { groups, isNext }



    } catch (error) {
        console.error("Error fetching groups:", error);
        throw error;
    }
}

