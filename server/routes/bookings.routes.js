const path = require("path");
const express = require("express");
const router = express.Router();
const {
  getBookings,
  getUpcomingBookingsByUserId,
  addBooking,
  // updateBooking,
  removeBooking,
} = require("../controllers/booking.controller");

router
  .get("/", getBookings)
  .get("/:userId", getUpcomingBookingsByUserId)
  .post("/", addBooking)
  // .put("/:id", updateBooking)
  .delete("/:id", removeBooking);

module.exports = router;
