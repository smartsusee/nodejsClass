const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
  role: {
    type: String,
    default: "user",
  },
});

// ds is a document
module.exports = mongoose.model("tamilTeachers", dataSchema);
