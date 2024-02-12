const punycode = require('punycode/')
const Proposal = require('../models/proposal.model')

const create = async (data) => {
	data.name = punycode.toASCII(data.name)
	const proposal = new Proposal(data)
	return await proposal.save()
}

const getOne = async (user, id) => {
	const proposal = await Proposal.findOne({ _id: id, user }).populate('domain', { name: 1 })
	return proposal
}

const get = async (query) => {
	if (query.name) query.name = punycode.toASCII(query.name)
	const proposals = await Proposal.find(query).populate('domain', { name: 1 })
	return proposals
}

const update = async (user, id, data) => {
	const proposal = await Proposal.findOneAndUpdate({
		_id: id,
		status: 'pending',
		user
	}, data, { new: true })
	return proposal
}

const deleteOne = async (user, id) => {
	const proposal = await Proposal.findOneAndDelete({ _id: id, status: 'pending', user })
	return proposal
}

module.exports = {
	create,
	getOne,
	get,
	update,
	deleteOne
}
