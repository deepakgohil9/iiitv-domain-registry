const express = require('express')
const controller = require('../controllers/subdomain.controller')
const dto = require('../dtos/subdomain.dto')
const validate = require('../middlewares/validate.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

const router = express.Router()

router.use(authMiddleware)
router.get('/', validate(dto.get), controller.get)
router.get('/:id', validate(dto.getOneAndDelete), controller.getOne)

router.use(isAdminMiddleware)
router.post('/approve/:id', validate(dto.approveProposal), controller.approveProposal)

module.exports = router
