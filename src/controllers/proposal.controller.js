const ProposalService = require('../services/proposal.service')
const DomainService = require('../services/domain.service')
const ApiResponse = require('../utils/ApiResponse')
const httpErrors = require('../utils/httpErrors')
const HttpException = require('../utils/HttpException')

const create = async (req, res, next) => {
	try {
		// TODO: Validate the request if subdomain already exists and managed by other user

		const domain = await DomainService.getDomainById(req.body.domain)
		if (!domain) {
			throw new HttpException(httpErrors.NOT_FOUND, 'Domain not found')
		} else if (!domain.isActive) {
			throw new HttpException(httpErrors.BAD_REQUEST, 'Domain is not active')
		}

		const proposal = await ProposalService.create({ user: req.user.id, ...req.body })
		res.status(201).json(new ApiResponse('Proposal created', proposal))
	} catch (error) {
		next(error)
	}
}

const getOne = async (req, res, next) => {
	try {
		let proposal
		if (req.user.isAdmin) {
			proposal = await ProposalService.getOne(req.params.id)
		} else {
			proposal = await ProposalService.getOne(req.params.id, req.user.id)
		}

		if (!proposal) {
			throw new HttpException(httpErrors.NOT_FOUND, 'Proposal not found')
		}

		res.status(200).json(new ApiResponse('Proposal retrieved', proposal))
	} catch (error) {
		next(error)
	}
}

const get = async (req, res, next) => {
	try {
		const query = req.query
		if (!req.user?.isAdmin) {
			query.user = req.user.id
		}

		const proposals = await ProposalService.get(query)
		res.status(200).json(new ApiResponse('Proposals retrieved', proposals))
	} catch (error) {
		next(error)
	}
}

const update = async (req, res, next) => {
	try {
		const proposal = await ProposalService.update(req.user.id, req.params.id, req.body)
		if (!proposal) {
			throw new HttpException(httpErrors.NOT_FOUND, 'Proposal not found')
		}

		res.status(200).json(new ApiResponse('Proposal updated', proposal))
	} catch (error) {
		next(error)
	}
}

const deleteOne = async (req, res, next) => {
	try {
		const proposal = await ProposalService.deleteOne(req.user.id, req.params.id)
		if (!proposal) {
			throw new HttpException(httpErrors.NOT_FOUND, 'Proposal not found')
		}

		res.status(200).json(new ApiResponse('Proposal deleted', proposal))
	} catch (error) {
		next(error)
	}
}

module.exports = {
	create,
	getOne,
	get,
	update,
	deleteOne
}
