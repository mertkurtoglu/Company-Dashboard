const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  country: { type: String, required: true },
  website: { type: String, required: true },
  date: { type: Date },
});

module.exports = mongoose.model("Company", companySchema, "companies");
