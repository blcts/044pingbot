import { Telegraf } from "telegraf";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const chatId = String(ctx.chat.id);
  const isAdmin = process.env.ADMIN_IDS.split(",").includes(chatId);

  await User.updateOne(
    { chatId: chatId },
    { chatId: chatId, role: isAdmin ? "ADMIN" : "CLIENT" },
    { upsert: true }
  );

  ctx.reply("Welcome! Click below to open the Mini App.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Open Mini App", web_app: { url: process.env.WEBAPP_URL } }]
      ]
    }
  });
});

export default bot;
