const mongoose = require("mongoose");

const localDBName = "crae";
const { MONGODB_URI = `mongodb://localhost/${localDBName}` } = process.env;

console.log("MONGODB_URI", MONGODB_URI);

const promise = mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Googled
  })
  .then(function (db) {
    console.log("DATABASE CONNECTED!!", MONGODB_URI);
  })
  .catch(function (err) {
    console.log("CONNECTION ERROR", err);
  });
