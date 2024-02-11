const DomainService = require('../services/domain.service')
const ApiResponse = require('../utils/ApiResponse')
const httpErrors = require('../utils/httpErrors')
const HttpException = require('../utils/HttpException')

const createDomain = async (req, res, next) => {
	try {
		let domain = await DomainService.getDomains({ name: req.body.name })
		if (domain.length) throw new HttpException(httpErrors.BAD_REQUEST, 'Domain already exists!')

		domain = await DomainService.createDomain(req.body)
		res.send(new ApiResponse('Domain created successfully!', domain))
	} catch (error) {
		next(error)
	}
}

const getDomains = async (req, res, next) => {
	try {
		const domains = await DomainService.getDomains(req.query)
		res.send(new ApiResponse('Domains fetched successfully!', domains))
	} catch (error) {
		next(error)
	}
}

const getDomainById = async (req, res, next) => {
	try {
		const domain = await DomainService.getDomainById(req.params.id)
		if (!domain) throw new HttpException(httpErrors.NOT_FOUND, 'Domain not found!')

		res.send(new ApiResponse('Domain fetched successfully!', domain))
	} catch (error) {
		next(error)
	}
}

const updateDomain = async (req, res, next) => {
	try {
		const domain = await DomainService.updateDomain(req.params.id, req.body)
		if (!domain) throw new HttpException(httpErrors.NOT_FOUND, 'Domain not found!')
		res.send(new ApiResponse('Domain updated successfully!', domain))
	} catch (error) {
		next(error)
	}
}

module.exports = {
	createDomain,
	getDomains,
	getDomainById,
	updateDomain
}
