import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  chat_id: { type: String, required: true, unique: true },
  role: { type: String, enum: ["ADMIN", "CLIENT"], required: true }
});

export default mongoose.model("User", userSchema);
