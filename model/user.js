import 'dotenv/config'
import mongoose from "mongoose"


const {Schema} = mongoose

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    street:{
        type:String,
        default:''
    },
    apartment:{
        type:String,
        default:''
    },
    zip:{
        type:String,
        default:''
    },
    city:{
        type:String,
        default:''
    },
    country:{
        type:String,
        default:''
    }

})

UserSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

UserSchema.set('toJSON',{
    virtuals:true
})



export const User = mongoose.model('users',UserSchema)