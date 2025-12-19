const express = require("express");

const app = express();

const mongoose = require("mongoose");
const dataSchema = require("./schema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const router = require("./controller/router");
const jwt = require("jsonwebtoken");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/router", router);

//  return the Promise method
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("db is connected ");
  })
  .catch(() => {
    console.log("db is not connected ");
  });

function verifyToken(req, res, next) {
  let getToken = req.headers.authorization.split(" ")[1];
  console.log(getToken);
  if (!getToken) return res.json({ msg: "token not found" });

  jwt.verify(getToken, process.env.secretKey, (err, decode) => {
    req.authedication = decode;

    next();
  });
}

// verifyToken
app.get("/", async (req, res) => {
  // console.log(req.authedication.role);

  try {
    // if (req.authedication.role === "admin") {
    let getData = await dataSchema.find();
    res.json(getData);
    // } else {
    // res.json({ msg: "you are not admin , Only Access For Admin" });
    // }
  } catch (err) {
    console.log(err);
  }
});

// middleware

app.post("/register", async (req, res) => {
  try {
    // let hassPassword = await bcrypt.hash(req.body.password, 7);

    const data = dataSchema({
      ...req.body,
      // password: hassPassword,
    });

    let existingEmail = await dataSchema.findOne({ email: req.body.email });

    if (existingEmail) return res.json({ msg: "email already exist" });

    const saveData = await data.save();

    res.json({ msg: "data Added Successfully", saveData });
  } catch (err) {
    console.log(err);
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    let updateData = await dataSchema.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({ msg: "data updated Successfully", updateData });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  let VerifiedData = await dataSchema.findOne({ email: req.body.email });

  console.log(VerifiedData);
  if (!VerifiedData) return res.json({ msg: "email not found" });

  let PasswordVerify = await bcrypt.compare(
    req.body.password,
    VerifiedData.password
  );

  if (!PasswordVerify) return res.json({ msg: "password not found" });

  let Token = await jwt.sign(
    { name: VerifiedData.name, role: VerifiedData.role },
    process.env.secretKey,
    { expiresIn: "1h" }
  );
  res.json({ msg: "login successfully", Token });
});

app.delete("/Delete/:id", async (req, res) => {
  try {
    let DeleteData = await dataSchema.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "data DeleteData Successfully", DeleteData });
  } catch (err) {
    console.log(err);
  }
});

// dataSchema.updateOne({name:""} , {$set:{nasdnqdn}})

app.listen(process.env.PORT, () => {
  console.log(`server running port on : ${process.env.PORT}`);
});
