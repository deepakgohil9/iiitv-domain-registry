const Joi = require('joi')

const approveProposal = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({
		id: Joi.string().hex().length(24).required()
	})
}

const get = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({
		user: Joi.string().hex().length(24),
		name: Joi.string().disallow('@', 'www'),
		domain: Joi.string().hex().length(24),
		type: Joi.string().valid('A', 'AAAA', 'TXT', 'CNAME', 'MX', 'NS')
	}),
	params: Joi.object().keys({})
}

const getOne = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({
		id: Joi.string().hex().length(24).required()
	})
}

module.exports = {
	approveProposal,
	get,
	getOne
}
