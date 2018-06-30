const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const mongoose = require("mongoose");
const routes = require('./routes')

const app = express();
routes(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.listen(process.env.PORT || 8080)
mongoose.connect("mongodb://localhost/immigrant")