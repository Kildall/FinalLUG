import { Schema, model, Types } from "mongoose";
const mua = require('mongoose-unique-array')

interface CartItem {
    item: {
        _id: Types.ObjectId
        name: String,
        stock: number,
        price: number
    },
    amount: number
}

const cartModel = new Schema({
    total: {
        type: Number,
        default: 0
    },
    items: [
        {
            item: {
                type:  Schema.Types.ObjectId,
                ref: 'Item',
                required: true,
                unique: true
            },
            amount: { type: Number, default: 1},
        },
        
    ]
})

cartModel.plugin(mua);

//Calcular el total
//Evento post guardado del documento
cartModel.post('save', async (cart) => {
    //Popular el campo de items ya que solo guardamos las referencias (https://mongoosejs.com/docs/populate.html#population)
    //Debido a que trabajamos con typescript debemos declarar una interfaz que corresponda a las propiedades que deberia tener nuestro modelo populado
    //Esta interfaz se la pasamos como tipo para exclusivamente la propiedad `items` de nuestro modelo populado, para luego decirle que ese es el campo a popular
    //mongoose mapea las propiedades del modelo referenciado a la interfaz provista.
    //Una vez populado esto, obtenemos un objeto con una propiedad de items populada donde typescript conoce su tipo (https://mongoosejs.com/docs/typescript/populate.html)
    const populatedCart = await cart.populate<{ items: CartItem[] }>('items.item')
    //Pongo el total en 0 antes de volver a calcularlo
    cart.total = 0
    //Por cada uno de los items populados
    for(const populatedItem of populatedCart.items){
        //Obtengo el index del item en el carrito correspondiente a este guardado
        const itemIndex = cart.items.findIndex(x => x.item._id === populatedItem.item._id)
        //Si la cantidad que estoy intentando guardar es mayor al stock existente
        if(populatedItem.amount > populatedItem.item.stock){
            //Cambiar la cantidad al maximo disponible
            cart.items[itemIndex].amount = populatedItem.item.stock
            //Calcular el total
            cart.total += populatedItem.item.price * cart.items[itemIndex].amount
            //Guardar los nuevos datos (Recursivo)
            await cart.save()
        } else {
            cart.total += populatedItem.item.price * cart.items[itemIndex].amount
        }        
    }
});

export default model('Cart', cartModel)