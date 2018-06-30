const db = require("./models")
const volunteerSignUp = require("./auth/signup").volunteerSignUp
const organizationSignUp = require("./auth/signup").organizationSignUp
const Organization = db.Organization
const Volunteer = db.Volunteer
const Request = db.Request

const MessagingResponse = require('twilio').twiml.MessagingResponse;
module.exports = function(app,passport){

	app.post('/sms', (req, res) => {
  		const twiml = new MessagingResponse();

 	 	twiml.message('The Robots are coming! Head for the hills!');

 	 	res.writeHead(200, {'Content-Type': 'text/xml'});
 	 	res.end(twiml.toString());
	}),

	app.get("/start",function(req,res){
		res.json({
			msg:"Started"
		})
	}),

	app.post("/api/register", function(req,res){
		let registerCallback = function(data){
			if(data.success){
				res.json({
					success: true,
					message: "Awesome You're Signed Up!"
				})
			}else {
				res.json({
					success:false,
					message: "Try again :("
				})
			}
		}
		if(req.body.type ===  "Volunteer"){
			volunteerSignUp({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				borough: req.body.borough,
				password: req.body.password
			}, registerCallback)
		}else if (req.body.type === "Organization"){
			organizationSignUp({
				email: req.body.email,
				org_name: req.body.last_name,
				borough: req.body.borough,
				password: req.body.password
			}, registerCallback)
		}
	}),

	app.post("/api/login", function(req,res){
		let activeUser;
		let type;
		if(req.body.type === "Volunteer"){
			activeUser = Volunteer
			type = "Volunteer"
		}else if (req.body.type === "Organization"){
			activeUser = Organization
			type = "Organization"
		}
		activeUser.findOne({email:req.body.email},function(err,user){
			if(err){
				return res.json({msg:"ERROR"})
			}
			if(!user){
				return res.json({success:false, msg:"user doesn't exist"})
			}
			if(!bcrypt.compareSync(req.body.pass, user.password)){
				return res.json({success:false, msg: "incorrect email/password"})
			}
			if(user && bcrypt.compareSync(req.body.pass, user.password)){
				var payload = {id:user._id,type:type}
				var token =jwt.sign(payload, process.env.token)
				return res.json({success:true, msg:"ok",token:token})
			}	
		})
	}),

	app.get("/api/volunteersInArea", passport.authenticate('jwt', { session: false }), function(req,res){
		Volunteer.find({borough:req.user.borough}, function(err,volunteers){
			res.json({volunteers:volunteers})
		})
	}),

	app.post("/api/request", function(req,res){
		new Request({
			req_id: req.body.id,
			level: req.body.level,
			created_at: new Date()
		})
	})

}
