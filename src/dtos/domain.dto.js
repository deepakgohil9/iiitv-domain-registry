const Joi = require('joi')

const createDomain = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		cloudflareApiKey: Joi.string().required(),
		cloudflareEmail: Joi.string().required(),
		cloudflareZoneId: Joi.string().required()
	}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({})
}

const getDomain = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({
		name: Joi.string(),
		isActive: Joi.boolean()
	}),
	params: Joi.object().keys({})
}

const getOneDomain = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({
		id: Joi.string().required().hex().length(24).required()
	})
}

const updateDomain = {
	body: Joi.object().keys({
		name: Joi.string(),
		cloudflareApiKey: Joi.string(),
		cloudflareEmail: Joi.string(),
		cloudflareZoneId: Joi.string(),
		isActive: Joi.boolean()
	}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({
		id: Joi.string().required().hex().length(24).required()
	})
}

module.exports = {
	createDomain,
	getDomain,
	getOneDomain,
	updateDomain
}
