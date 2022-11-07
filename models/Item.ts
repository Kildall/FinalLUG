import { Schema, model } from "mongoose";

const itemModel = new Schema({
    name: { type: String, require: true },
    stock: { type: Number, min: 0, require: true },
    price: {type: Number, min: 0, require: true }
})

export default model('Item', itemModel)