import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", true);
export const connectDB = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "message-v2",
    });
    console.log(`Database is connected 🚀`);
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on the port ${process.env.PORT}📡`);
    });
  } catch (error) {
    console.log("Error" + error.message);
    process.exit(1);
  }
};
