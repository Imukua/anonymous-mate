import mongoose from "mongoose";

const supportGroupSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,

    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    bio: String,
    picture: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    founder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    ]
});


const SupportGroup = mongoose.connection.models.SupportGroup || mongoose.model("SupportGroup", supportGroupSchema);

export default SupportGroup;