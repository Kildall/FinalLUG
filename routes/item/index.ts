import { Router } from 'express'
import itemController from '../../controllers/item'

const router = Router()

router.get('/', itemController.getItem)
router.get('/:itemId', itemController.getItem)
router.post('/create-item', itemController.createItem)
router.put('/update-item/:itemId', itemController.updateItem)
router.delete('/delete-item/:itemId', itemController.deleteItem)

export default router