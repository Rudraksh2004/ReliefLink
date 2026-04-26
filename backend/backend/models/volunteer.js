const mongoose = require("../db");

const volunteerSchema = new mongoose.Schema({
  name: String,
  skills: [String],
  available: Boolean
});

module.exports = mongoose.model("Volunteer", volunteerSchema);