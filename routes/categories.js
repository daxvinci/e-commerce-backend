import express from "express"
const router = express.Router()
import { Category } from "../model/category.js"

router.get('/', async (req,res)=>{
    try{
        const result = await Category.find({})
        res.send(result)
    }catch(err){
        console.log(err)
    }
})

router.get('/:id', async (req,res)=>{
    const _id = req.params.id
    try{
        const result = await Category.findById(_id)
        if(result){
            res.send(result)
        }else{
            res.status(400).json({message:"category not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.put('/:id',async (req,res)=>{
    const _id = req.params.id
    const {name,icon,color} = req.body
    try{
        const replaced = await Category.findByIdAndUpdate(_id,{
            name:name,
            icon:icon,
            color:color
        },{new:true})
        res.send(replaced)
    }catch(err){
        res.status(500).json({message:err})
    }
})

router.post('/', async(req,res)=>{
    const {name,icon,color} = req.body
    const category = new Category({
        name:name,
        icon:icon,
        color:color
    })

    try{
        const saved = await category.save()  
        res.send(saved)
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "An error occurred while saving the product." })
    }
})

router.delete('/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const removed = await Category.findByIdAndDelete(_id)
        if(removed){
            console.log("deleted succesffully")
            res.status(200).json({success:true, message:"Succesfully deleted"})
        }else{
            console.log("cant find")
            res.status(400).json({success:false, message:"category not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, error:err})
    }
})

export default router;