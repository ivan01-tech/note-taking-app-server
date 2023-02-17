import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { join } from "path";
import { logEvent } from "../middleware/logger.js";
dotenv.config({ path: join(process.cwd(), "src", ".env") });

const dbConnection = async function () {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(process.env.DATABASE_URL!, {});
  } catch (err: any) {
    if (err) {
      logEvent(`${err.no}: ${err.code} ${err.syscal}`, "mongoError.log");
      console.log("error : ", err.message);
    }
  }
};

export default dbConnection;
