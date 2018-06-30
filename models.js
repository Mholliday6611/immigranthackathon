const mongoose = require('mongoose')

const volunteer = new mongoose.Schema({
	first_name: String,
	last_name: String,
	password: String,
	email: String,
	borough: String,
	created_at: Date
})

const organization = new mongoose.Schema({
	org_name: String,
	password: String,
	email: String,
	borough: String,
	events: [],
	created_at: Date
})

const request = new mongoose.Schema({
	req_id: String,
	level: String,
	org_responded: {type: String, default: "NONE"},
	response: String,
	created_at: Date
})

module.exports = {
	Volunteer : mongoose.model("volunteer",volunteer),
	Organization : mongoose.model("organization", organization),
	Request : mongoose.model("request", request)
}