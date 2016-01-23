var Application = new models.application({
	name: "testapplication",
	key: "rar"
});

var instance1 = new models.instance({
	name: "flavor1"
})

var instance2 = new models.instance({
	name: "flavor2"
})
var data = {};
data.counter = "dsjflkds";

Application.instances = [];
Application.instances.push(instance1);
Application.instances.push(instance2);

Application.saveAll().then(function (){
	console.log(Application);
	//models.application.get(Application.id).addRelation('instances', {id: instance1.id})
	for (var i = 0; i < 5; i++){
		models.application.filter({name: "testapplication", key: "rar"}).getJoin().then(function(app, err) {
			models.instance.filter({name: "flavor1"}).getJoin().then(function(instance, err) {
				if(instance.counters ==  undefined) instance.counters = {}
				if (instance.counters[data.counter] == undefined) instance.counters[data.counter] = 1;
				else instance.counters[data.counter] += 1;
				Application.saveAll().then(function(){
					instance.counters[data.counter] += 1;

					console.log(instance.counters[data.counter]);
					console.log(Application)
				})
				console.log(instance.counters[data.counter]);
			});
		});
	}
	for (var i = 0; i < 5; i++){
		models.application.filter({name: "testapplication", key: "rar"}).getJoin().then(function(app, err) {
			models.instance.filter({name: "flavor2"}).getJoin().then(function(instance, err) {
				if(instance.counters ==  undefined) instance.counters = {}
				if (instance.counters[data.counter] == undefined) instance.counters[data.counter] = 1;
				else instance.counters[data.counter] += 1;
				Application.saveAll()
				console.log(instance.counters[data.counter]);
			});
		});
	}
	Application.saveAll().then(function (){
		console.log(Application);
	});
})
/*
models.application.filter({name: data.appName, key: data.key}).getJoin().then(function(app, err) {
	models.instance.filter({name: data.instance, applicationId: app.id}).getJoin().then(function(instance, err) {
		if (instance.counters[data.counter] == undefined) instance.counters[data.counter] = 1;
		else instance.counters[data.counter] += 1;
		instance.saveAll();
	});
});
*/