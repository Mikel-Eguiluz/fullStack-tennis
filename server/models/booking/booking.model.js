const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookingSchema = new Schema({
  startDateTime: {
    type: Date,
    required: true,
  },
  court: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
