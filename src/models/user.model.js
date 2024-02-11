const mongoose = require('mongoose')

const user = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	profilePic: {
		type: String
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model('user', user)
