const express = require("express");

const app = express();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "img"));
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/imgUpload", upload.single("image"), async (req, res) => {
  try {
    res.json("file uploaded Successfully....!");
  } catch (err) {
    console.log(err);
  }
});

app.listen(3003, () => {
  console.log("server is running port , 3003");
});
