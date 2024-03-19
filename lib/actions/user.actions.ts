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
