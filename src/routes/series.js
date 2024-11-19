const express = require("express");
const router = express.Router();

const seriesController = require("../controllers/series.controller");
const authController = require("../controllers/auth.controller");

router.route("/")
    .get(seriesController.findAll)
    .post(authController.auth, seriesController.add);

router.route("/pages")
    .get(seriesController.getAllPages);

router.route("/:seriesID")
    .get(seriesController.findById);

module.exports = router;