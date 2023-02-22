import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { join } from "path";
import { logEvent } from "../middleware/logger.js";
dotenv.config({ path: join(process.cwd(), "src", ".env") });

const dbConnection = async function () {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATABASE_URL!);
  } catch (err) {
    //   await logEvent(`${err.no}: ${err.code} ${err.syscal}`, "mongoError.log");
    console.log("error : ", err);
    //   return;
  }
};

export default dbConnection;
