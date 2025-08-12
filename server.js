import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import User from "./models/User.js";
import bot from "./bot.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = process.env.ADMIN_IDS.split(",");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.post("/ping", async (req, res) => {
      try {
        const { chatId, firstName, username } = req.body;
        console.log("Received ping from:", chatId, firstName, username);
    
        await User.updateOne(
          { chatId },
          { chatId, firstName, username, role: "USER" },
          { upsert: true }
        );
    
        const text = `User ${firstName} (@${username || "no username"}) clicked the Ping button.`;
    
        for (const adminId of ADMIN_IDS) {
          console.log(`Sending message to admin chat_id: ${adminId}`);
          const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: adminId, text }) // note: chat_id with underscore
          });
          const data = await response.json();
          console.log("Telegram API response:", data);
        }
    
        res.json({ success: true });
      } catch (err) {
        console.error("Error in /ping:", err);
        res.status(500).json({ success: false });
      }
    });
    

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
  
  bot.launch()
  .then(() => console.log("Telegram bot launched"))
  .catch(console.error);
})();
