const Booking = require("../models/booking/booking.model");
const { errorHandler } = require("./utils");

exports.getBookings = function (req, res) {
  let query = {
    startDateTime: { $gte: new Date().toISOString() },
  };
  Booking.find(query)
    .populate("owner")
    .exec((err, bookings) => {
      if (err) return errorHandler(res, err);
      return res.status(200).json(bookings);
    });
};
exports.getUpcomingBookingsByUserId = function (req, res) {
  let query = {
    userId: req.params.userId,
    startDateTime: { $gte: new Date().toISOString() },
  };
  console.log(query);
  Booking.find(query)
    .populate("owner")
    .exec((err, bookings) => {
      if (err) return errorHandler(res, err);
      return res.status(200).json(bookings);
    });
};

exports.addBooking = function (req, res) {
  const bookingData = req.body;
  console.log("bookingData", bookingData);
  const newBooking = new Booking(bookingData);
  newBooking.save((err, booking) => {
    if (err) return errorHandler(res, err);
    return res.status(201).json(booking);
  });
};

exports.updateBooking = function (req, res) {
  Booking.updateOne({ _id: req.params.id }, req.body, function (err) {
    if (err) return errorHandler(res, err);
    res.sendStatus(200);
  });
};

exports.removeBooking = function (req, res) {
  Booking.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return errorHandler(res, err);
    res.sendStatus(204);
  });
};
