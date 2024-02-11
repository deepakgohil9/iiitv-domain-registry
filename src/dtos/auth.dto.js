const Joi = require('joi')

const auth = {
	body: Joi.object().keys({
		code: Joi.string().required()
	}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({})
}

module.exports = { auth }
