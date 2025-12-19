const express = require("express");
const { getMethod, postMethod } = require("./crud");

const router = express.Router();

router.get("/viewData", getMethod);
router.post("/postData", postMethod);

module.exports = router;
