import mongoose from "mongoose";
import { envConfig } from "./env.config";

export async function connectDb() {
  try {
    await mongoose
      .connect(envConfig.DB.MONGO_DB_URL)
      .then((res) => console.log("Main Db connected successfully"));
  } catch (error) {
    if (error instanceof Error) {
      console.log("Main Db error", error.message);
    }
  }
}
