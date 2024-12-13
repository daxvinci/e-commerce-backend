import 'dotenv/config'
import mongoose from "mongoose"


const {Schema} = mongoose

const CategorySchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    icon:{
        type:String
    },
    color:{
        type:String
    }
})

CategorySchema.virtual('id').get(function(){
    return this._id.toHexString()
})

CategorySchema.set('toJSON',{
    virtuals:true
})



export const Category = mongoose.model('categories',CategorySchema)