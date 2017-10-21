// var mongoose = require('mongoose');

// // Database configuration with mongoose
// mongoose.connect("mongodb://localhost/news");
// var db = mongoose.connection;

// // This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function (error) {
//     console.log("MongoDB Connection Error. Make sure MongoDB is running.", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function () {
//     console.log("Mongoose connection successful.");
// });

// var NewsSchema = new mongoose.Schema({
//     title: String,
//     summary: String
// });

// module.exports = mongoose.model('Articles', NewsSchema);