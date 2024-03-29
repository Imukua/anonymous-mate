import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    picture: String,
    bio: String,
    onboarded: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    supportGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SupportGroup"
        },
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    ],
});


const User = mongoose.connection.models.User || mongoose.model("User", userSchema);
export default User;