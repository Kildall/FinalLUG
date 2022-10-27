import { Router } from 'express'
import itemController from '../../controllers/item'

const router = Router()

router.get('/:itemId', itemController.get)
router.post('/create-item', itemController.create)
router.put('/update-item/:itemId', itemController.update)
router.delete('/delete-item/:itemId', itemController.delete)

export default router