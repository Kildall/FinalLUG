import { Types, Document } from 'mongoose'

class MongooseStockError {
    name: String
    messages: String[]
    ids: Types.ObjectId[]
    cart: Document | undefined

    constructor(message: String[], cart: Document, ids: Types.ObjectId[]) {
        this.name = 'MongooseStockError'
        this.messages = message
        this.ids = ids
        this.cart = cart
    }
}

export default MongooseStockError