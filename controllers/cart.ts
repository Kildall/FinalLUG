import { Request, Response } from 'express'
import CartModel from '../models/Cart'

export default {
    getCart: async (req: Request, res: Response) => {
        //Recived cartId in params
        const { cartId } = req.params
        if(!cartId){
            res.status(400).send('cartId invalido.')
            return
        }
        
        try {
            const cart = await CartModel.findById(cartId)
            if(!cart){
                res.status(404).send('cartId no encontrado.')
                return
            }
            res.status(200).send(cart)
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
        
    },
    createCart: async (req: Request, res: Response) => {
        //Recived item list (items) in body
        //TODO: Insert items from body to initial cart
        try {
            const cart = new CartModel()
            await cart.save()
            res.status(200).send(cart)
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    addItemToCart: async (req: Request, res: Response) => {
        //Received item list (items) in body and cartId in params
        //TODO: Insert items from body into the cart

    },
    updateItemFromCart: async (req: Request, res: Response) => {
        //Received 2 item list (oldItems, newItems) and cartId in params
        //TODO: Update items in cart with new items
    },
    deleteItemFromCart: async (req: Request, res: Response) => {
        //Received item list (items) and cartId in params
        //TODO: Delete items from list from the cart
    },
    deleteCart: async (req: Request, res: Response) => {
        //Received cartId in params
        //TODO: Delete cart
    }
}