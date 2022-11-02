import { Schema, model } from "mongoose";

const itemModel = new Schema({
    name: { type: String, require: true },
    amount: { type: Number, min: 0 },
    price: {type: Number, min: 0}
})

export default model('Item', itemModel)