import mongoose from "mongoose";

let isConnected = false;

export const connectTodb = async () => {
    //strict query to prevent unknown collection
    mongoose.set("strictQuery", true);

    //Ensure connection isnt made yet and connection URL exists
    if (isConnected) return console.log("db connection already made ");
    if (!process.env.MONGO_URL) return console.log("No mongoose URL set");

    //proceed to make connection
    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log("db connection made");
    } catch (error) {
        console.log("cannot connect to db: ", error);
    }
};