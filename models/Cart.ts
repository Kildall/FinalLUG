import { Schema, model, Types } from "mongoose";
import MongooseStockError from "../types/MongooseStockError";

const cartModel = new Schema({
    total: {
        type: Number,
        default: 0
    },
    items: [
        {
            item: {
                type:  Schema.Types.ObjectId,
                ref: 'Item'
            },
            amount: Number
        },
    ]
})

interface CartItem {
    item: {
        _id: Types.ObjectId
        name: String,
        amount: number,
        price: number
    },
    amount: number
}

//Calcular el total
//Evento post guardado del documento
cartModel.post('save', async (cart) => {
    //Popular el campo de items ya que solo guardamos las referencias (https://mongoosejs.com/docs/populate.html#population)
    //Debido a que trabajamos con typescript debemos declarar una interfaz que corresponda a las propiedades que deberia tener nuestro modelo populado
    //Esta interfaz se la pasamos como tipo para exclusivamente la propiedad `items` de nuestro modelo populado, para luego decirle que ese es el campo a popular
    //mongoose mapea las propiedades del modelo referenciado a la interfaz provista.
    //Una vez populado esto, obtenemos un objeto con una propiedad de items populada donde typescript conoce su tipo (https://mongoosejs.com/docs/typescript/populate.html)
    const doc = await cart.populate<{ items: CartItem[] }>('items.item')
    var error_ocurred = new MongooseStockError([], cart, [])
    cart.total = 0
    for(const cartItem of doc.items){
        
        if(cartItem.item.amount < cartItem.amount){
            cart.items = cart.items.filter(x => x.item?._id !== cartItem.item._id)
            
            error_ocurred.ids.push(cartItem.item._id)
            error_ocurred.messages.push(`El item con id ${cartItem.item._id} no cuenta con stock suficiente.`)
            continue
        } else {
            cart.total += cartItem.item.price * cartItem.amount
        }
        
    }
    if(error_ocurred.messages.length > 0)
        throw error_ocurred
});

export default model('Cart', cartModel)