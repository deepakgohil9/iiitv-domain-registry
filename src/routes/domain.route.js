const express = require('express')
const controller = require('../controllers/domain.controller')
const dto = require('../dtos/domain.dto')
const validate = require('../middlewares/validate.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

const router = express.Router()

router.use(authMiddleware)
router.get('/', validate(dto.getDomain), controller.getDomains)

router.use(isAdminMiddleware)
router.post('/', validate(dto.createDomain), controller.createDomain)
router.get('/:id', validate(dto.getOneDomain), controller.getDomainById)
router.put('/:id', validate(dto.updateDomain), controller.updateDomain)

module.exports = router
