const prepareBody = (proposal) => {
	let body = null
	switch (proposal.type) {
	case 'A':
	case 'AAAA':
	case 'CNAME':
		body = {
			comment: `Managed by IIITV Registry, User Id: ${proposal.user}`,
			content: proposal.content,
			name: proposal.name,
			proxied: proposal.proxied,
			type: proposal.type,
			ttl: proposal.ttl
		}
		break
	case 'TXT':
		body = {
			comment: `Managed by IIITV Registry, User Id: ${proposal.user}`,
			content: proposal.content,
			name: proposal.name,
			type: proposal.type,
			ttl: proposal.ttl
		}
		break
	case 'MX':
		body = {
			comment: `Managed by IIITV Registry, User Id: ${proposal.user}`,
			content: proposal.content,
			name: proposal.name,
			priority: proposal.priority,
			type: proposal.type,
			ttl: proposal.ttl
		}
		break
	case 'NS':
		body = {
			comment: `Managed by IIITV Registry, User Id: ${proposal.user}`,
			content: proposal.content,
			name: proposal.name,
			type: proposal.type,
			ttl: proposal.ttl
		}
		break
	}

	return JSON.stringify(body)
}

const createDnsRecord = async (credential, proposal) => {
	const url = `https://api.cloudflare.com/client/v4/zones/${credential.zoneId}/dns_records`

	const body = prepareBody(proposal)
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${credential.apiKey}`
		},
		body
	}

	const response = await fetch(url, options)
	const data = await response.json()
	if (!data.success) throw new Error(`Failed to create DNS record! ${JSON.stringify(data.errors)}`)
	return data.result?.id
}

const overwriteDnsRecord = async (credential, recordId, proposal) => {
	const url = `https://api.cloudflare.com/client/v4/zones/${credential.zoneId}/dns_records/{recordId}`

	const body = prepareBody(proposal)
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${credential.apiKey}`
		},
		body
	}

	const response = await fetch(url, options)
	const data = await response.json()
	if (!data.success) throw new Error(`Failed to overwrite DNS record! ${JSON.stringify(data.errors)}`)
	return data.result?.id
}

const deleteDnsRecord = async (credential, recordId) => {
	const url = `https://api.cloudflare.com/client/v4/zones/${credential.zoneId}/dns_records/${recordId}`

	const options = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${credential.apiKey}`
		}
	}

	const response = await fetch(url, options)
	const data = await response.json()
	if (!response.ok) throw new Error(`Failed to delete DNS record! ${JSON.stringify(data.errors)}`)
	return data.result?.id
}

module.exports = {
	createDnsRecord,
	overwriteDnsRecord,
	deleteDnsRecord
}
