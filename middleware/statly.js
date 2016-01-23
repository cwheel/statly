module.exports = {
	clockRequest: function(req, res) {
		var start = process.hrtime();

		res.end = (function() {
		    var cached = res.end;

		    return function() {
		        var end = process.hrtime(start);

		        console.log(req.user.username);
		        console.log(((end[0]*1000) + (end[1]/1000000)) + "ms");

		        var result = cached.apply(this, arguments);

		        return result;
		    };
		})();
	},
	initialize: function () {
		return function(req, res, next) {
			if (req.user != undefined) {

			} else {

			}
			
			next();
		}
	}
}