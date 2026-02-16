import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  hotelId: String,
  password: String,
  status: {
    type: String,
    default: "active",
  },
  expiry: Date,
  subscription: String,
  access: Array,
});

export default mongoose.models.Hotel ||
  mongoose.model("Hotel", HotelSchema);
