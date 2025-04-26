import mongoose from "mongoose";
import dotenv from "dotenv";
// mongoose.set("strictQuery", true);
dotenv.config();

const PORT = process.env.PORT || 8000;

export const connectDB = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "message-v2",
    });
    console.log(`Database is connected 🚀`);
    app.listen(PORT, () => {
      console.log(`Server is listening on the port ${PORT}📡`);
    });
  } catch (error) {
    console.log("Error" + error.message);
    process.exit(1);
  }
};
