import { Router } from 'express'
import cartRouter from './cart'

const router = Router()

//Rutas de la api
router.use('/cart', cartRouter)

export default router