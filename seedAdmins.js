import 'dotenv/config';
import mongoose from "mongoose";
import User from "./models/User.js";

async function seedAdmins() {
  await mongoose.connect(process.env.MONGO_URI);

  const adminIds = process.env.ADMIN_IDS.split(",");

  for (const id of adminIds) {
    await User.updateOne(
      { chatId: id },
      { chatId: id, role: "ADMIN" },
      { upsert: true }
    );
  }

  console.log("Admins seeded!");
  mongoose.disconnect();
}

seedAdmins();
