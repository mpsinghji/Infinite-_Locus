import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Infinite_Locus",
    });

    console.log("MongoDB is successfully connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default connectdb;