import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Your bot handlers
bot.start((ctx) => {
  ctx.reply("Welcome! Click below to open the Mini App.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Open Mini App", web_app: { url: process.env.WEBAPP_URL } }],
      ],
    },
  });
});

// Disable polling on serverless — we only handle updates via webhook
bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}`);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
