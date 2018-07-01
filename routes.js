const db = require("./models")
const volunteerSignUp = require("./auth/signup").volunteerSignUp
const organizationSignUp = require("./auth/signup").organizationSignUp
const Organization = db.Organization
const Volunteer = db.Volunteer
const Request = db.Request
const Event = db.Event

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.accountSid;
const authToken = process.env.authtoken;
const client = require('twilio')(accountSid, authToken);


module.exports = function(app,passport){

	app.post('/sms', function(req, res){
  		const twiml = new MessagingResponse();
  		console.log(req.body)
  		let message = req.body.Body.toLowerCase()
  	
 		if(message == "start"){
 			twiml.message('Select a Language; Text 1 for English, 2 para Espanol')
		}

		else if(message == "1"){
			//F L HEALTH HOUSING
			twiml.message("Text F for 'Food Help', Text L for 'Legal Services',Text Health for 'Health Services' or Text Housing for 'Housing Help'") 
		}
		else if(message == "2"){
			//C J S A
			twiml.message("Escriba C for 'Ayuda Alimenticia', Text J for 'Servicios Jurídicos',Text S for 'Servicios de salud' or Text A for 'Servicios de vivienda'") 
		}

		else if(message == "f" || message == "l" || message == "health" || message == "housing"){
			var typeOfHelp;
			var resources;
			if(message == "f"){
				typeOfHelp = "Food Services"
				resources = "https://www.foodbanknyc.org/get-help/"
			}else if(message == "l"){
				typeOfHelp = "Legal Services"
				resources = "https://www.informedimmigrant.com/resource-type/find-a-legal-provider-tools/"
			}else if(message == "health"){
				typeOfHelp = "Health Services"
				resources = "https://www.informedimmigrant.com/resource-type/healthcare/"
			}else if(message == " hosuing"){
				typeOfHelp = "Housing Services"
				resources = "https://www.informedimmigrant.com/resource-type/steps-to-take-to-prepare-your-family/"
			}
			twiml.message(`Thank you for your request, you will be contacted as soon as possible with help! Here are some resources in the meantime ${resources}`)
			client.messages
		      .create({
		         body: `Hey, can you help out this person in need, they need help with ${typeOfHelp}. You can call or message them at ${req.body.From}`,
		         from: '+19083565448',
		         to: process.env.englishnumber
		       })
		      .then(message => console.log(message.sid))
		      .done();
		}

		else if(message == "c" || message == "j" || message == "s" || message == "a"){
			let typeOfHelp;
			var resources;
			if(message == "c"){
				typeOfHelp = "Ayuda Alimenticia"
				resources = "https://www.foodbanknyc.org/get-help/"
			}else if(message == "j"){
				typeOfHelp = 'Servicios Jurídicos'
				resources = "https://www.informedimmigrant.com/resource-type/find-a-legal-provider-tools/"
			}else if(message == "s"){
				typeOfHelp = "Servicios de salud"
				resources = "https://www.informedimmigrant.com/resource-type/healthcare/"
			}else if(message == "a"){
				typeOfHelp = "Servicios de vivienda"
				resources = "https://www.informedimmigrant.com/resource-type/steps-to-take-to-prepare-your-family/"
			}

			twiml.message(`Gracias por su solicitud, lo contactaremos lo antes posible con ayuda. Aquí hay algunos recursos ${resources}`)

			client.messages
		      .create({
		         body: `Hey, can you help out this person in need, they are a spanish speaker and need help with ${typeOfHelp}. You can call or message them at ${req.body.From}`,
		         from: '+19083565448',
		         to: process.env.spanishnumber
		       })
		      .then(message => console.log(message.sid))
		      .done();
		}

		
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
			request: req.body.request,
			location: req.body.location,
			created_at: new Date()
		}).save(function(err,request){
			if(err){
				res.send("error")
			}else{
				res.send(request)
			}
		})
	}),

	app.post("/api/createevent", passport.authenticate('jwt', { session: false }), function(req,res){
		new Event({
			address: req.body.address,
			org: req.user.id,
			title: req.body.title,
			description: req.body.description,
			created_at: new Date()
		}).save(function(err,event){
			if(err){
				res.send("Error")
			}else{
				req.user.events.push(event.id)
				req.user.save(function(err,saved){
					console.log(saved)
				})
			}
		})
	}),

	app.get("/api/getRequestInArea", passport.authenticate('jwt', { session: false }), function(req,res){
		Request.find({location:req.user.borough}, function(err,requests){
			res.json({requests:requests})
		})
	})



}
