import mongoose from "mongoose";

const gmSchema = new mongoose.Schema({
  hotelId: String,
  name: String,
  email: String,
  password: String,
  access: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GM || mongoose.model("GM", gmSchema);
