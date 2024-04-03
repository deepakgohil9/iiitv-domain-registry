const jwt = require('jsonwebtoken')
const userService = require('../services/user.service')
const { getAuthUrl, getAccountFromCode } = require('../utils/googleOauth')
const ApiResponse = require('../utils/ApiResponse')
const httpErrors = require('../utils/httpErrors')
const HttpException = require('../utils/HttpException')

const getGoogleAuthUrl = async (req, res, next) => {
	try {
		const url = getAuthUrl()
		res.send(new ApiResponse('Google auth url generated successfully!', { url }))
	} catch (error) {
		next(error)
	}
}

const googleSignIn = async (req, res, next) => {
	try {
		const data = await getAccountFromCode(req.body.code)
		// const domain = data.email.split('@')[1]
		// if (domain !== 'iiitvadodara.ac.in' && domain !== 'iiitv.ac.in') {
		// throw new HttpException(httpErrors.FORBIDDEN, 'Only IIIT Vadodara students and faculty are allowed to sign in!')
		// }

		let user = await userService.findUserByEmail(data.email)
		if (!user) {
			user = await userService.createUser({
				email: data.email,
				name: data.name,
				profilePic: data.picture
			})
		}

		const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_SECRET, { expiresIn: '1d' })
		res.send(new ApiResponse('User signed in successfully!', { token }))
	} catch (error) {
		if (error.message === 'invalid_grant') {
			return next(new HttpException(httpErrors.BAD_REQUEST, 'Invalid code!'))
		}

		next(error)
	}
}

module.exports = {
	getGoogleAuthUrl,
	googleSignIn
}
