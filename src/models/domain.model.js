const mongoose = require('mongoose')

const domain = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	cloudflareApiKey: {
		type: String,
		required: true
	},
	cloudflareEmail: {
		type: String,
		required: true
	},
	cloudflareZoneId: {
		type: String,
		required: true
	},
	isActive: {
		type: Boolean,
		default: true
	}
})

module.exports = mongoose.model('domain', domain)
