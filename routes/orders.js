import express from "express"
const router = express.Router()
import { Order } from "../model/order.js"
import { OrderItem } from "../model/orderItem.js"

router.get('/', async (req,res)=>{
    try{
        const result = await Order.find({}).populate('user','name').sort({'dateOrdered':-1})
        res.send(result)
    }catch(err){
        console.log(err)
    }
})

router.get('/:id', async (req,res)=>{
    try{
        const result = await Order.findById(req.params.id)
        .populate('user','name')
        .populate({
            path:'orderItems', populate:{
                path:'product',populate:'category'
            }
        })
        res.send(result)
    }catch(err){
        console.log(err)
    }
})

router.post('/', async(req,res)=>{
    const {orderItems,shippingAddress1,
        shippingAddress2,city,zip,country,
        phone,status,totalPrice,user} = req.body
        const newOrderItems = await Promise.all(orderItems.map(async orderItem => {
            let newItem = new OrderItem({
                quantity:orderItem.quantity,
                product:orderItem.product
            })
            newItem = await newItem.save()
            return newItem._id
        }))
    const orderItemsResolved = await newOrderItems

    const resolvedItemsPrice = await Promise.all(orderItemsResolved.map(async item => {
        const itemDetails = await OrderItem.findById(item).populate('product')
        const priceTotal = itemDetails.quantity * itemDetails.product.price
        return priceTotal
    }))

    const sumPrice = resolvedItemsPrice.reduce((acc,num)=>acc+num,0)

    const order = new Order({
        orderItems:orderItemsResolved,
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        status,
        totalPrice:sumPrice,
        user
    })
    try{
        const saved = await order.save()  
        if(!saved){
            res.status(400).send("order cannot be created")
        }
        res.send(saved)
    }catch(err){
        console.log(err)
        res.status(500).send("server Error")
    }
})

router.put('/:id', async(req,res)=>{

    const updatedOrderStatus = await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})
    try{
        const saved = await updatedOrderStatus.save()
        res.send(saved)
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "An error occurred while saving the order." })
    }
})

router.delete('/:id',async (req,res)=>{
    const orderId = req.params.id
    try{
        const removed = await Order.findByIdAndDelete(orderId)
        if(removed){
            removed.orderItems.map(async item => {
                const deletedItems = await OrderItem.findByIdAndDelete(item)
                if(deletedItems){
                    console.log("subItems deleted")
                }
            })
            console.log("deleted succesffully")
            res.status(200).json({success:true, message:"Succesfully deleted"})
        }else{
            console.log("cant find")
            res.status(400).json({success:false, message:"Order not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, error:err})
    }
})

router.get('/get/totalsales',async (req,res)=>{
    const totalsales = await Order.aggregate([
        {$group:{_id:null,totalsales:{$sum:'$totalPrice'}}}
    ])

    if(!totalsales){
        return res.status(400).send("the order cannot be generated")
    }

    res.send({totalsales:totalsales})
})

router.get('/get/count', async (req,res)=>{
    try{
        const orderCount = await Order.countDocuments()
        if(orderCount){
            res.send({orderCount:orderCount})
        }else{
            res.status(500).send("error no order count")
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.get('/get/userorders/:userid', async (req,res)=>{
    try{
        const userOrderList = await Order.find({user:req.params.userid})
        .populate({path:'orderItems',populate:{
            path:'product',populate:'category'
        }}).sort({'dateOrdered':-1})
        res.send(userOrderList)
    }catch(err){
        console.log(err)
    }
})

export default router;