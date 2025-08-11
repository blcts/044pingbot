import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./database.js";
import bot from "./bot.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("views"));

app.post("/ping", async (req, res) => {
  const { userId, firstName } = req.body;
  const admins = await User.find({ role: "ADMIN" });

  for (let admin of admins) {
    bot.telegram.sendMessage(
      admin.chat_id,
      `User ${firstName} (ID: ${userId}) clicked the Ping button`
    );
  }

  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  bot.launch();
})();
