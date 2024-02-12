const express = require('express')
const controller = require('../controllers/proposal.controller')
const dto = require('../dtos/proposal.dto')
const validate = require('../middlewares/validate.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.use(authMiddleware)
router.post('/', validate(dto.create), controller.create)
router.get('/', validate(dto.get), controller.get)
router.get('/:id', validate(dto.getOneAndDelete), controller.getOne)
router.put('/:id', validate(dto.update), controller.update)
router.delete('/:id', validate(dto.getOneAndDelete), controller.deleteOne)

module.exports = router
