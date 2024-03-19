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
