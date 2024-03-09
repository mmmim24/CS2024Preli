const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
    station_id: {type: Number, required: true},
    arrival_time: {type: String, required: false},
    departure_time: {type: String, required: false},
    fare: {type: Number, required: true}
})

const trainSchema = new mongoose.Schema({
  train_id: {type: Number, required: true},
  train_name: {type: String, required: true},
  capacity: {type: Number, required: true},
  stops: [stopSchema]
});

module.exports = mongoose.model("Trains", trainSchema);