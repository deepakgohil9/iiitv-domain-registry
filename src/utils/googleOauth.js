const { OAuth2Client } = require('google-auth-library')

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const redirectUri = process.env.GOOGLE_REDIRECT_URI

const client = new OAuth2Client(clientId, clientSecret, redirectUri)

const getAuthUrl = () => {
	return client.generateAuthUrl({
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	})
}

const getAccountFromCode = async (code) => {
	const { tokens } = await client.getToken(code)
	client.setCredentials(tokens)
	const { data } = await client.request({ url: 'https://www.googleapis.com/oauth2/v1/userinfo' })
	return data
}

module.exports = {
	getAuthUrl,
	getAccountFromCode
}
