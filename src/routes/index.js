const express = require("express");
const userRoute = require("./user");
const seriesRoute = require("./series");

const router = express.Router();

router.use("/user", userRoute);
router.use("/series", seriesRoute);

module.exports = router;