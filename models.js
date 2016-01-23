var Thinky = require('thinky')({db: "statly"});

var User = Thinky.createModel("User", {
	id: String,
	name: String,
	username: String,
	password: String
});

var Application = Thinky.createModel("Application", {
	id: String,
	name: String,
	key: String
});

var Instance = Thinky.createModel("Instance", {
	id: String,
	loadAvg: Array,
	username: String,
	password: String,
	counters: Object
});

var LoadedRoute = Thinky.createModel("LoadedRoute", {
	id: String,
	user: String,
	route: String
});

var TimedRoute = Thinky.createModel("TimedRoute", {
	id: String,
	user: String,
	route: String,
	time: Number
});

User.hasMany(Application, "applications", "id", "userId");
Application.hasMany(Instance, "instances", "id", "applicationId");
Instance.hasMany(LoadedRoute, "loadedRoutes", "id", "instanceId");
Instance.hasMany(LoadedRoute, "timedRoutes", "id", "instanceId");

module.exports = {
	user: User,
	application: Application,
	instance: Instance,
	loadedRoute: LoadedRoute,
	timedRoute: TimedRoute
};