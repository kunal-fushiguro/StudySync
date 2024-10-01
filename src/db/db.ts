import mongoose from "mongoose";
import { MONGODB_URL } from "@/utils/env";

let isConnected: boolean = false;

async function connectDb() {
  if (isConnected) {
    console.log("Databse Connected ...........");
    return;
  }
  try {
    const db = await mongoose.connect(String(MONGODB_URL), {
      dbName: "studysync",
    });

    if (db.connections[0].readyState) {
      isConnected = true;
    }

    console.log(`Database connected successfully .............`);
  } catch (error) {
    console.error("Database Connection Error : ", error);
    process.exit(1);
  }
}

export { connectDb };
