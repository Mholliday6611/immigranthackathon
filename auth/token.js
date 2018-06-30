var passportJWT = require("passport-jwt")
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var Volunteer = require("./model").Volunteer;
var Organization = require("./model").Organization;

module.exports= function(passport){
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
jwtOptions.secretOrKey = process.env.token

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done){
	console.log("payload received", jwt_payload);
	if(jwt_payload.type === "Volunteer"){
		User.findOne({_id: jwt_payload.id}, function(err,user) {
			if(err){
				return done(err, false);
			}
			if(user){
				return done(null, user);
			}else{
				return done(null, false)
			}
		});
		}
	else if(jwt_payload.type ==="Organization"){
		Organization.findOne({_id: jwt_payload.id}, function(err,user) {
			if(err){
				return done(err, false);
			}
			if(user){
				return done(null, user);
			}else{
				return done(null, false)
			}
		});
		}	
	}))	
}