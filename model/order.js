
import mongoose from "mongoose"


const {Schema} = mongoose

const OrderSchema = new Schema({
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"orderItems",
        required:true
    }],
    shippingAddress1:{
        type:String,
        req:true
    },
    shippingAddress2:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    totalPrice:{
        type:Number,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    dateOrdered:{
        type:Date,
        default:Date.now
    }
})

OrderSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

OrderSchema.set('toJSON',{
    virtuals:true
})



export const Order = mongoose.model('orders',OrderSchema)