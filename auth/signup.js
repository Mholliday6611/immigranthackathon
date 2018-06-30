var bcrypt = require("bcrypt-nodejs");
var Volunteer = require("../models").Volunteer;
var Organization = require("../models").Organization;

	module.exports = {
		volunteerSignUp: function(user, callback){
			new Volunteer({
				first_name: user.first_name,
				last_name: user.last_name,
				password: bcrypt.hashSync(user.pass),
				borough: user.borough,
				email: user.email,
				createdAt: new Date().toLocaleDateString()
			}).save(function(err,volunteer){
				if(err){
					callback({
						"success": false,
						"reason": "Failed to save user"
					});
				} else {
					callback({
						"success": true,
						"doc": volunteer,
						"reason": "Saved user"
					});
				}
			});
		},
		organizationSignUp: function(user, callback){
			new Organization({
				org_name: user.org_name,
				password: bcrypt.hashSync(user.pass),
				email: user.email,
				borough: user.borough,
				createdAt: new Date().toLocaleDateString()
			}).save(function(err,org){
				if(err){
					callback({
						"success": false,
						"reason": "Failed to save user"
					});
				} else {
					callback({
						"success": true,
						"doc": org,
						"reason": "Saved user"
					});
				}
			});
		}
	}