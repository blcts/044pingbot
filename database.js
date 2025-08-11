import mongoose from "mongoose";
import User from "./models/User.js";

export async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);

  const adminIds = process.env.ADMIN_IDS.split(",").map(id => id.trim());
  for (let id of adminIds) {
    await User.updateOne(
      { chat_id: id },
      { chat_id: id, role: "ADMIN" },
      { upsert: true }
    );
  }
}
