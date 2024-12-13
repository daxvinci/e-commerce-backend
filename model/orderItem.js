
import mongoose from "mongoose"


const {Schema} = mongoose

const OrderItemSchema = new Schema({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true
    }
})

OrderItemSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

OrderItemSchema.set('toJSON',{
    virtuals:true
})

export const OrderItem = mongoose.model('orderItems',OrderItemSchema)