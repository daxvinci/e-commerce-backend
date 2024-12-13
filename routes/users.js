import express from "express"
const router = express.Router()
import { User } from "../model/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

router.get('/', async (req,res)=>{
    try{
        const user = await User.find({},'-passwordHash')
        console.log(user)
        res.send(user)
    }catch(err){
        console.log(err)
    }
})

router.get('/:id', async (req,res)=>{
    const paramsId = req.params.id
    try{
        const user = await User.find({id:paramsId},'-passwordHash')
        console.log(user)
        res.send(user)
    }catch(err){
        console.log(err)
    }
})

router.post('/login', async (req,res)=>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email:email})
        const secret = process.env.SECRET
        if(user && await bcrypt.compare(password,user.passwordHash)){
            const token = jwt.sign(
                {
                    userId:user.id,
                    isAdmin:user.isAdmin
                },
                secret,
                {expiresIn:"1d"}
            )
            res.send({user:user.email, token:token})
        }else{
            res.status(400).send("Wrong email or password")
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
})

router.post('/register', async(req,res)=>{
    const {name,email,password,phone,isAdmin,street,apartment,zip,city,country} = req.body
    const hashedPassword = await bcrypt.hash(password,10)
    
    const users = new User({
        name,
        email,
        passwordHash : hashedPassword,
        phone,
        isAdmin,
        street,
        apartment,
        zip,
        city,
        country
    })

    try{
        const saved = await users.save()  
        res.send(saved)
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "An error occurred while saving the product." })
    }
})

router.get('/get/count', async (req,res)=>{
    try{
        const userCount = await User.countDocuments()
        if(userCount){
            res.send({userCount:userCount})
        }else{
            res.status(500).send("error no product count")
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.delete('/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const removed = await User.findByIdAndDelete(_id)
        if(removed){
            console.log("deleted User succesffully")
            res.status(200).json({success:true, message:"Succesfully deleted"})
        }else{
            console.log("cant find User")
            res.status(400).json({success:false, message:"Error User not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, error:err})
    }
})

export default router;