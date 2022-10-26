import { Schema, model } from "mongoose";

const itemModel = new Schema({
    name: String,
    amount: Number,
    price: Number
})

export default model('Item', itemModel)