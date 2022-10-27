import { Schema, model } from "mongoose";

const cartModel = new Schema({
    total: {
        type: Number,
        default: 0
    },
    items: [
        {
            type:  Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]
})

interface Item {
    name?: String,
    amount?: number,
    price: number
}

//Calcular el total
//Evento post guardado del documento
cartModel.post('save', async (cart) => { 
    //Popular el campo de items ya que solo guardamos las referencias (https://mongoosejs.com/docs/populate.html#population)
    //Debido a que trabajamos con typescript debemos declarar una interfaz que corresponda a las propiedades que deberia tener nuestro modelo populado
    //Esta interfaz se la pasamos como tipo para exclusivamente la propiedad `items` de nuestro modelo populado, para luego decirle que ese es el campo a popular
    //mongoose mapea las propiedades del modelo referenciado a la interfaz provista.
    //Una vez populado esto, obtenemos un objeto con una propiedad de items populada donde typescript conoce su tipo (https://mongoosejs.com/docs/typescript/populate.html)
    const doc = await cart.populate<{ items: Item[] }>('items')
    //Utilizamos map para obtener unicamente un array con los precios de los items del carrito. (https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array)
    //Luego utilizamos reduce para obtener el resultado de la suma de los precios (https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers)
    cart.total = doc.items.map(item => item.price).reduce((sum, next) => sum + next, 0)
    console.log(cart.total)
});

export default model('Cart', cartModel)