import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import User from "./models/User.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = process.env.ADMIN_IDS.split(",");

// Called when mini app button is clicked
app.post("/ping", async (req, res) => {
  try {
    const { chatId, firstName, username } = req.body;

    // Ensure user is in DB
    await User.updateOne(
      { chatId },
      { chatId, firstName, username, role: "USER" },
      { upsert: true }
    );

    const text = `User ${firstName} (@${username || "no username"}) clicked the Ping button.`;

    // Send to all admins
    for (const adminId of ADMIN_IDS) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: adminId, text })
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
