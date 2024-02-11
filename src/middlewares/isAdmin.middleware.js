const httpErrors = require('../utils/httpErrors')
const HttpException = require('../utils/HttpException')

module.exports = async (req, res, next) => {
	try {
		if (!req.user?.isAdmin) {
			throw new HttpException(httpErrors.FORBIDDEN, 'You are not authorized to perform this action!')
		}

		next()
	} catch (error) {
		next(error)
	}
}
