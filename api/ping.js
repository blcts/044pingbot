import mongoose from "mongoose";
import User from "../models/User.js";  // adjust path
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = process.env.ADMIN_IDS.split(",");

let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await connectToDB();

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
        body: JSON.stringify({ chat_id: adminId, text }),
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
