var Thinky = require('thinky')({db: "statly"});

var User = Thinky.createModel("User", {
	id: String,
	name: String,
	username: String,
	password: String
});

module.exports = {
	User: User
};