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
        // - cartId -> ObjectId (Opcional)
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
        // - cartId -> ObjectId 
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
                let existingItem = cart.items.find(x => x.item == item.item) // Busco el item que estoy intentando agregar
                if(existingItem){ // Si ya existe en el carrito
                    cart.items[cart.items.indexOf(existingItem)].amount += item.amount // Sumo las cantidades
                } else { // Si no existe
                    cart.items.push(item) //Lo agrego al carrito
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
        // - cartId -> ObjectId 
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
                let existingItem = cart.items.find(x => x.item == item.item) // Busco el item que estoy intentando eliminar
                if(!existingItem) return // Si no existe entonces paso al siguiente

                if(existingItem!.amount > item.amount){ // Si la cantidad que hay en el carrito es mayor a la que quiero sacar
                    cart.items[cart.items.indexOf(existingItem!)].amount -= item.amount // Resto las cantidades
                } else { // Si no
                    cart.items.splice(cart.items.indexOf(existingItem!), 1) //Elimino el objeto
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
        // - cartId -> ObjectId 
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