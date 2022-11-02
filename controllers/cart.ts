import { Request, Response } from 'express'
import { Types } from 'mongoose'
import Cart from '../models/Cart'
import CartModel from '../models/Cart'
import item from './item'

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
        try {
            const cart = new CartModel({items: req.body.items})
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

        try {
            const { cartId } = req.params
            if(!cartId){
                res.status(400).send('cartId invalido.')
                return
            }
            
            const cart = await CartModel.findById(cartId)

            if(!cart){
                res.status(404).send('cartId no encontrado.')
                return
            }

            req.body.items.forEach((item:Types.ObjectId) => {
                cart.items.push(item)
            });

            cart.save()
            
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    updateItemFromCart: async (req: Request, res: Response) => {
        //Received 2 item list (oldItems, newItems) and cartId in params
        //TODO: Update items in cart with new items

        try {
            const { cartId } = req.params
            if(!cartId){
                res.status(400).send('cartId invalido.')
                return
            }
            
            const cart = await CartModel.findById(cartId)

            if(!cart){
                res.status(404).send('cartId no encontrado.')
                return
            }

            req.body.newItems.forEach((item:Types.ObjectId) => {
                cart.items.push(item)
            });

            cart.save()

        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }

    },
    deleteItemFromCart: async (req: Request, res: Response) => {
        //Received item list (items) and cartId in params
        //TODO: Delete items from list from the cart

        try {
            const { cartId } = req.params
            if(!cartId){
                res.status(400).send('cartId invalido.')
                return
            }
            
            const cart = await CartModel.findById(cartId)

            if(!cart){
                res.status(404).send('cartId no encontrado.')
                return
            }

            cart.items.filter(item => req.body.items.find(item))

            cart.save()

        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }



    },
    deleteCart: async (req: Request, res: Response) => {
        //Received cartId in params
        //TODO: Delete cart

        const { cartId } = req.params
        if(!cartId){
            res.status(400).send('cartId invalido.')
            return
        }
        
        try {
            const cart = await CartModel.findByIdAndDelete(cartId)
            res.status(200).send(cart)

        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }

    }
}