import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: String,
    supportGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SupportGroup"
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
    ,
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;