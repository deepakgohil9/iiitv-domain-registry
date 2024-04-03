const mongoose = require('mongoose')
const punycode = require('punycode/')
const Proposal = require('../models/proposal.model')
const Subdomain = require('../models/subdomain.model')
const cf = require('../remotes/cloudflare.remote')

const createSubdomain = async (proposal) => {
	const session = await mongoose.startSession()
	try {
		const credentials = {
			zoneId: proposal.domain.cloudflareZoneId,
			email: proposal.domain.cloudflareEmail,
			apiKey: proposal.domain.cloudflareApiKey
		}

		session.startTransaction()
		const recordId = await cf.createDnsRecord(credentials, proposal)
		const subdomain = new Subdomain({
			user: proposal.user,
			name: proposal.name,
			domain: proposal.domain,
			type: proposal.type,
			content: proposal.content,
			ttl: proposal.ttl,
			priority: proposal.priority,
			proxied: proposal.proxied,
			dnsRecordId: recordId
		})
		await subdomain.save()
		await Proposal.findByIdAndUpdate(proposal._id, { status: 'approved' })

		await session.commitTransaction()
		await session.endSession()
		return subdomain
	} catch (error) {
		await session.abortTransaction()
		await session.endSession()
		throw error
	}
}

const updateSubdomain = async (proposal) => {
	const session = await mongoose.startSession()
	try {
		const credentials = {
			zoneId: proposal.domain.cloudflareZoneId,
			email: proposal.domain.cloudflareEmail,
			apiKey: proposal.domain.cloudflareApiKey
		}

		session.startTransaction()
		const subdomain = await Subdomain.findOne({ name: proposal.name, domain: proposal.domain })
		if (!subdomain) throw new Error('Subdomain not found!')
		const oldRecordId = subdomain.dnsRecordId

		const recordId = await cf.updateDnsRecord(credentials, oldRecordId, proposal)
		const updatedSubdomain = await Subdomain.findByIdAndUpdate(subdomain._id, {
			name: proposal.name,
			domain: proposal.domain,
			type: proposal.type,
			content: proposal.content,
			ttl: proposal.ttl,
			priority: proposal.priority,
			proxied: proposal.proxied,
			dnsRecordId: recordId
		}, { new: true })
		await Proposal.findByIdAndUpdate(proposal._id, { status: 'approved' })

		await session.commitTransaction()
		await session.endSession()
		return updatedSubdomain
	} catch (error) {
		await session.abortTransaction()
		await session.endSession()
		throw error
	}
}

const deleteSubdomain = async (proposal) => {
	const session = await mongoose.startSession()
	try {
		const credentials = {
			zoneId: proposal.domain.cloudflareZoneId,
			email: proposal.domain.cloudflareEmail,
			apiKey: proposal.domain.cloudflareApiKey
		}

		session.startTransaction()
		const subdomain = await Subdomain.findOne({ name: proposal.name, domain: proposal.domain })
		if (!subdomain) throw new Error('Subdomain not found!')
		const oldRecordId = subdomain.dnsRecordId

		await cf.deleteDnsRecord(credentials, oldRecordId)
		const deletedSubdomain = await Subdomain.findByIdAndDelete(subdomain._id)
		await Proposal.findByIdAndUpdate(proposal._id, { status: 'approved' })

		await session.commitTransaction()
		await session.endSession()
		return deletedSubdomain
	} catch (error) {
		await session.abortTransaction()
		await session.endSession()
		throw error
	}
}

const getSubdomain = async (query) => {
	if (query.name) query.name = punycode.toASCII(query.name)
	const subdomains = await Subdomain.find(query).populate('domain', { name: 1 })
	return subdomains
}

const getOne = async (id, user = null) => {
	const query = { _id: id }
	if (user) query.user = user

	const subdomain = await Subdomain.findOne(query).populate('domain', { name: 1 })
	return subdomain
}

module.exports = {
	createSubdomain,
	updateSubdomain,
	deleteSubdomain,
	getSubdomain,
	getOne
}
