import { Request, Response } from 'express'
import ItemModel from '../models/Item'

export default {
    get: async (req: Request, res: Response) => {
        //Recived itemId in params
        const { itemId } = req.params
        if(!itemId){
            res.status(400).send('itemId invalido.')
            return
        }
        
        try {
            const cart = await ItemModel.findById(itemId)
            if(!cart){
                res.status(404).send('itemId no encontrado.')
                return
            }
            res.status(200).send(cart)
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
        
    },
    create: async (req: Request, res: Response) => {
        //Recived item in body
        //TODO: Insert items from body
        try {
            const cart = new ItemModel({...req.body})
            await cart.save()
            res.status(200).send(cart)
        } catch (error) {
            console.log(error)
            res.status(500).send('Ha ocurrido un error.')
        }
    },

    update: async (req: Request, res: Response) => {
        //Received itemId in params and new item in body
        //TODO: Update item
    },
    delete: async (req: Request, res: Response) => {
        //Received itemId in params
        //TODO: Delete item
    },

}