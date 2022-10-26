import { Schema, model } from "mongoose";

const cartModel = new Schema({
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
}, {
    virtuals:{
        total: {
            get() {
                this.populate('items')
                this.items.forEach(item => {
                    console.log(item)
                })
                return 0
            }
        }
    }
})

export default model('Cart', cartModel)