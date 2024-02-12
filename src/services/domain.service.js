const Domain = require('../models/domain.model')

const createDomain = async (data) => {
	const domain = Domain(data)
	await domain.save()
	return domain
}

const getDomains = async (query, showCredential = false) => {
	const domains = await Domain.find(query, showCredential ? {} : { name: 1, isActive: 1 })
	return domains
}

const getDomainById = async (id) => {
	const domain = await Domain.findById(id)
	return domain
}

const updateDomain = async (id, data) => {
	const domain = await Domain.findByIdAndUpdate(id, data, { new: true })
	return domain
}

module.exports = {
	createDomain,
	getDomains,
	getDomainById,
	updateDomain
}
