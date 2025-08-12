import mongoose from "mongoose";
import User from "../models/User.js";  
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = process.env.ADMIN_IDS.split(",");
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  try {
    const { chatId, firstName, username } = req.body;

    await User.updateOne(
      { chatId },
      { chatId, firstName, username, role: "USER" },
      { upsert: true }
    );

    const text = `User ${firstName} (@${username || "no username"}) clicked the Ping button.`;

    for (const adminId of ADMIN_IDS) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: adminId, text })
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false });
  }
}