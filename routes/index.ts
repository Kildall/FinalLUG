import { Router, Request, Response } from 'express'
import cartRouter from './cart'

const router = Router()

//Version de la api
router.get('/', (req: Request, res: Response) => {
    const config = require('../package.json')
    res.status(200).send(`${config.description} v${config.version}`)
})


//Rutas de la api
router.use('/cart', cartRouter)

export default router