require("dotenv").config();
require("./src/databases/db");
require("./src/models/series-model");
require("./src/models/user-model");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const routes = require("./src/routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api", cors);
app.use("/images", express.static("images"));
app.use("/api", routes);

const server = app.listen(process.env.PORT, function () {
    console.log("Server  is running on " + server.address().port);
});