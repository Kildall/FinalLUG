import { Schema, model } from "mongoose";

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
        }
    ]
})

interface CartItem {
    item: {
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

    cart.total = 0
    doc.items.forEach((cartItem) => {
        cart.total += cartItem.item.price * cartItem.amount
    });
});

export default model('Cart', cartModel)