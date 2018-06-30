import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import passportJWT from "passport-jwt";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.listen(process.env.PORT || 8080)
mongoose.connect("mongodb://localhost/immigrant")