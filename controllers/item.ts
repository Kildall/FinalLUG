import { Request, Response } from 'express'
import ItemModel from '../models/Item'

export default {
    getItem: async (req: Request, res: Response) => {
        //Params:
        // - itemId -> ObjectId (Opcional)
        try {
            const { itemId } = req.params
            if(!itemId){
                const items = await ItemModel.find({})
                res.status(200).send(items)
                return
            } else {
                const item = await ItemModel.findById(itemId)
                if(!item){
                    res.status(404).send('Item no encontrado.')
                    return
                }
                res.status(200).send(item)
            }
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    createItem: async (req: Request, res: Response) => {
        //Body:
        // - name -> string
        // - stock -> number
        // - price -> number
        try {
            const { name, stock, price } : { name: String, stock: Number, price: Number} = req.body
            const cart = new ItemModel({name: name, stock: stock, price: price})
            await cart.save()
            res.status(200).send(cart)
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },

    updateItem: async (req: Request, res: Response) => {
        //Params:
        // - cartId -> ObjectId 
        //Body:
        // - name -> string
        // - stock -> number
        // - price -> number
        try {
            const { itemId } = req.params
            const { name, stock, price } : { name: String, stock: Number, price: Number} = req.body
            if(!itemId){
                res.status(400).send('itemId invalido.')
                return
            }
            const item = await ItemModel.findByIdAndUpdate(itemId, { name: name, stock: stock, price: price })
            if(!item){
                res.status(404).send('Item no encontrado.')
                return
            }
            res.status(200).send({oldItem: item})
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },
    deleteItem: async (req: Request, res: Response) => {
        //Params:
        // - itemId -> ObjectId (Opcional)
        try {
            const { itemId } = req.params
            if(!itemId){
                res.status(400).send('itemId invalido.')
                return
            }
            const item = await ItemModel.findByIdAndDelete(itemId)
            if(!item){
                res.status(404).send('Item no encontrado.')
                return
            }
            res.status(204).send()
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },

}