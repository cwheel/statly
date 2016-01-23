var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	user : 'string',
	pass : 'string'
})