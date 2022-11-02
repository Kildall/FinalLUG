import { Router } from 'express'
import cartController from '../../controllers/cart'

const router = Router()

router.get('/:cartId', cartController.getCart)
router.post('/create-cart', cartController.createCart)
router.post('/add-item/:cartId', cartController.addItemToCart)
router.put('/update-item/:cartId', cartController.updateItemFromCart)
router.delete('/remove-item/:cartId', cartController.removeItemFromCart)
router.delete('/delete-cart/:cartId', cartController.deleteCart)

export default router
