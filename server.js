require ('dotenv').load();

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const mongoose = require("mongoose");
const routes = require('./routes')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))

routes(app,passport)

app.listen(process.env.PORT || 8000)
console.log(process.env.token)
//mongoose.connect("mongodb://localhost/immigrant")
