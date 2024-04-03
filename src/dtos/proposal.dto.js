const Joi = require('joi')

const create = {
	body: Joi.object().keys({
		action: Joi.string().valid('create', 'update', 'delete').required(),
		domain: Joi.string().hex().length(24).required(),
		name: Joi.string().required().disallow('@', 'www'),
		content: Joi.string()
			.when('type', { is: 'A', then: Joi.string().ip({ version: ['ipv4'] }).required() })
			.when('type', { is: 'AAAA', then: Joi.string().ip({ version: ['ipv6'] }).required() })
			.when('type', { is: 'TXT', then: Joi.string().required() })
			.when('type', { is: 'CNAME', then: Joi.string().hostname().required() })
			.when('type', { is: 'MX', then: Joi.string().hostname().required() })
			.when('type', { is: 'NS', then: Joi.string().hostname().required() }),
		type: Joi.string().valid('A', 'AAAA', 'TXT', 'CNAME', 'MX', 'NS').required(),
		priority: Joi.number().integer().min(0).max(65535)
			.when('type', { is: 'MX', then: Joi.required(), otherwise: Joi.forbidden() }),
		ttl: Joi.number().integer().min(60).max(86400).allow(1).default(1),
		proxied: Joi.boolean().default(true)
			.when('type', { is: 'MX', then: Joi.forbidden() })
			.when('type', { is: 'NS', then: Joi.forbidden() })
			.when('type', { is: 'TXT', then: Joi.forbidden() }),
		purpose: Joi.string().required()
	}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({})
}

const get = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({
		user: Joi.string().hex().length(24),
		action: Joi.string().valid('create', 'update', 'delete'),
		name: Joi.string().disallow('@', 'www'),
		domain: Joi.string().hex().length(24),
		type: Joi.string().valid('A', 'AAAA', 'TXT', 'CNAME', 'MX', 'NS'),
		status: Joi.string().valid('pending', 'approved', 'rejected')
	}),
	params: Joi.object().keys({})
}

const getOneAndDelete = {
	body: Joi.object().keys({}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({
		id: Joi.string().hex().length(24).required()
	})
}

const update = {
	body: Joi.object().keys({
		content: Joi.string()
			.when('type', { is: 'A', then: Joi.string().ip({ version: ['ipv4'] }).required() })
			.when('type', { is: 'AAAA', then: Joi.string().ip({ version: ['ipv6'] }).required() })
			.when('type', { is: 'TXT', then: Joi.string().required() })
			.when('type', { is: 'CNAME', then: Joi.string().hostname().required() })
			.when('type', { is: 'MX', then: Joi.string().hostname().required() })
			.when('type', { is: 'NS', then: Joi.string().hostname().required() }),
		type: Joi.string().valid('A', 'AAAA', 'TXT', 'CNAME', 'MX', 'NS'),
		priority: Joi.number().integer().min(0).max(65535)
			.when('type', { is: 'MX', then: Joi.optional(), otherwise: Joi.forbidden() }),
		ttl: Joi.number().integer().min(60).max(86400).allow(1),
		proxied: Joi.boolean()
			.when('type', { is: 'MX', then: Joi.forbidden() })
			.when('type', { is: 'NS', then: Joi.forbidden() })
			.when('type', { is: 'TXT', then: Joi.forbidden() }),
		purpose: Joi.string()
	}),
	query: Joi.object().keys({}),
	params: Joi.object().keys({
		id: Joi.string().hex().length(24).required()
	})
}

module.exports = {
	create,
	get,
	getOneAndDelete,
	update
}
