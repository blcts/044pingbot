import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  firstName: String,
  username: String,
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
});

export default mongoose.model("User", userSchema);
