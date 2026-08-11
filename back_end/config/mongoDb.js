import mongoose from "mongoose";

const connectDb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Mongodb connected");
  });
  await mongoose.connect(`${process.env.MongoDb_Url}/RSU`);
};
export default connectDb;
