import { revalidatePath } from "next/cache";
import SupportGroup from "../models/support.group.model";
import User from "../models/user.model";
import { connectTodb } from "../mongoDB";

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



export async function fetchMembership(authUserId: string, groupId: string) {
    try {
        connectTodb();
        const user = await User.findOne({ authUserId });
        const group = await SupportGroup.findOne({ groupId }, { _id: 1 });

        const isMember = user.supportGroups.includes(group._id);
        return isMember;

    } catch (error) {
        console.log("Error fetching membership:", error);
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