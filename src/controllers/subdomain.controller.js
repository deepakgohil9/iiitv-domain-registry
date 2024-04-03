const SubdomainService = require('../services/subdomain.service')
const ProposalService = require('../services/proposal.service')
const ApiResponse = require('../utils/ApiResponse')
const httpErrors = require('../utils/httpErrors')
const HttpException = require('../utils/HttpException')

const approveProposal = async (req, res, next) => {
	try {
		const proposal = await (await ProposalService.getOne(req.params.id)).populate('domain')
		if (!proposal) {
			throw new HttpException(httpErrors.NOT_FOUND, 'Proposal not found')
		}

		const action = proposal.action
		let subdomain

		switch (action) {
		case 'create':
			subdomain = await SubdomainService.createSubdomain(proposal)
			break
		case 'update':
			subdomain = await SubdomainService.updateSubdomain(proposal)
			break
		case 'delete':
			subdomain = await SubdomainService.deleteSubdomain(proposal)
			break
		default:
			throw new HttpException(httpErrors.BAD_REQUEST, 'Invalid action')
		}

		delete subdomain.domain
		res.status(201).json(new ApiResponse('Proposal approved', subdomain))
	} catch (error) {
		next(error)
	}
}

const getOne = async (req, res, next) => {
	try {
		let subdomain
		if (req.user.isAdmin) {
			subdomain = await SubdomainService.getOne(req.params.id)
		} else {
			subdomain = await SubdomainService.getOne(req.params.id, req.user.id)
		}

		if (!subdomain) {
			throw new HttpException(httpErrors.NOT_FOUND, 'Subdomain not found')
		}

		res.status(200).json(new ApiResponse('Subdomain retrieved', subdomain))
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

		const subdomains = await SubdomainService.getSubdomain(query)
		res.status(200).json(new ApiResponse('Subdomains retrieved', subdomains))
	} catch (error) {
		next(error)
	}
}

module.exports = {
	approveProposal,
	getOne,
	get
}
