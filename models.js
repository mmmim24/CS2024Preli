const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  id: {type: Number, required: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  genre: {type: String, required: true},
  price: {type: Number, required: true},
});

module.exports = mongoose.model("Books", booksSchema);
