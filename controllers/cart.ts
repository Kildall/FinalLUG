import { Request, Response } from 'express'
import { Types } from 'mongoose'
import CartModel from '../models/Cart'

interface CartItem {
    item: Types.ObjectId
    amount: number
}

export default {
    getCart: async (req: Request, res: Response) => {
        //Params:
        // - cartId -> ObjectId as String (Opcional)
        try {
            const { cartId } = req.params
            if(!cartId){
                const carts = await CartModel.find({})
                res.status(200).send(carts)
                return
            } else {
                const cart = await CartModel.findById(cartId)
                if(!cart){
                    res.status(404).send('cartId no encontrado.')
                    return
                }
                res.status(200).send(cart)
            }
        } catch (error: any) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }

    },
    createCart: async (req: Request, res: Response) => {
        //Body:
        // - items -> [CartItem]
        try {
            const { items } : { items: CartItem[]} = req.body
            const cart = new CartModel({items: items})
            await cart.save()
            res.status(200).send(cart)
        } catch (error: any) {
            if(error?.errors?.items?.kind === 'user defined'){
                res.status(400).send('No se puede enviar el mismo item con multiples entradas.')
                return
            }
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    addItemToCart: async (req: Request, res: Response) => {
        //Params:
        // - cartId -> ObjectId as String
        //Body:
        // - items -> [CartItem]
        try {
            const { cartId } = req.params
            const { items } : { items: CartItem[] } = req.body
            if(!cartId){
                res.status(400).send('cartId invalido.')
                return
            }

            const cart = await CartModel.findById(cartId)

            if(!cart){
                res.status(404).send('Carrito no encontrado.')
                return
            }

            items.forEach((item) => {
                const existingItemIndex = cart.items.findIndex(x => x.item == item.item)
                if(existingItemIndex !== -1){
                    cart.items[existingItemIndex].amount += item.amount
                } else {
                    cart.items.push(item)
                }
            });

            await cart.save()
            res.status(200).send(cart)
        } catch (error: any) {
            if(error?.errors?.items?.kind === 'user defined'){
                res.status(400).send('No se puede enviar el mismo item con multiples entradas.')
                return
            }
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    removeItemFromCart: async (req: Request, res: Response) => {
        //Params:
        // - cartId -> ObjectId as String
        //Body:
        // - items -> [CartItem]
        try {
            const { cartId } = req.params
            const { items } : { items: CartItem[] } = req.body
            if(!cartId){
                res.status(400).send('cartId invalido.')
                return
            }
            const cart = await CartModel.findById(cartId)
            if(!cart){
                res.status(404).send('Carrito no encontrado.')
                return
            }

            items.forEach((item) => {
                const existingItem = cart.items.find(x => x.item == item.item)
                if(!existingItem) return

                if(existingItem.amount > item.amount){
                    cart.items[cart.items.indexOf(existingItem)].amount -= item.amount
                } else {
                    cart.items.splice(cart.items.indexOf(existingItem), 1)
                }
            });
            await cart.save()
            res.status(200).send(cart)
        } catch (error: any) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    deleteCart: async (req: Request, res: Response) => {
        //Params:
        // - cartId -> ObjectId as String
        try {
            const { cartId } = req.params
            if(!cartId){
                res.status(400).send('cartId invalido.')
                return
            }
            const cart = await CartModel.findByIdAndDelete(cartId)
            if(!cart){
                res.status(404).send('Carrito no encontrado.')
                return
            }
            res.status(204).send()
        } catch (error: any) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }

    }
}