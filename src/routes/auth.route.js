const express = require('express')
const controller = require('../controllers/auth.controller')
const dto = require('../dtos/auth.dto')
const validate = require('../middlewares/validate.middleware')

const router = express.Router()

router.get('/google', controller.getGoogleAuthUrl)
router.post('/google', validate(dto.auth), controller.googleSignIn)

module.exports = router
