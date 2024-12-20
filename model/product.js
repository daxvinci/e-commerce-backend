import 'dotenv/config'
import mongoose from "mongoose"


const {Schema} = mongoose

const ProductSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        default:'',
    },
    image:{
        type:String,
        default:''
    },
    images:[{
        type:String
    }],
    brand:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories',
        required:true
    },
    countInStock:{
        type:Number,
        min:0,
        max:255,
        required:true
    },
    rating:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
})

ProductSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

ProductSchema.set('toJSON',{
    virtuals:true
})


export const Product = mongoose.model('products',ProductSchema)
