const dataSchema = require("../schema");
const bcrypt = require("bcryptjs");

const getMethod = async (req, res) => {
  try {
    let getData = await dataSchema.find();
    res.json(getData);
  } catch (err) {
    console.log(err);
  }
};
const postMethod = async (req, res) => {
  try {
    let hassPassword = await bcrypt.hash(req.body.password, 7);

    const data = dataSchema({
      ...req.body,
      password: hassPassword,
    });

    let existingEmail = await dataSchema.findOne({ email: req.body.email });

    if (existingEmail) return res.json({ msg: "email already exist" });

    const saveData = await data.save();

    res.json({ msg: "data Added Successfully", saveData });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getMethod, postMethod };
