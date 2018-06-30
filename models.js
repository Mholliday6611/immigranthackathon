const mongoose = require('mongoose')

const volunteer = new mongoose.Schema({
	first_name: String,
	last_name: String,
	password: String,
	email: String,
	borough: String
})

const organization = new mongoose.Schema({
	org_name: String,
	password: String,
	email: String,
	borough: String,
	events: []
})

module.exports = {
	Volunteer : mongoose.model("volunteer",volunteer),
	organization : mongoose.model("organization", organization)
}