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
	name: String,
	loadAvg: Array,
	bandwith: Number,
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
	time: Number,
	date: Date
});

var Log = Thinky.createModel("Log",{
	id: String,
	level: Number,
	message: String,
	date: Date
})

User.hasMany(Application, "applications", "id", "userId");
Application.hasMany(Instance, "instances", "id", "applicationId");
Instance.hasMany(LoadedRoute, "loadedRoutes", "id", "instanceId");
Instance.hasMany(TimedRoute, "timedRoutes", "id", "instanceId");
Instance.hasMany(Log,"log","id","instanceId")

module.exports = {
	user: User,
	application: Application,
	instance: Instance,
	loadedRoute: LoadedRoute,
	timedRoute: TimedRoute,
	log: Log,
};