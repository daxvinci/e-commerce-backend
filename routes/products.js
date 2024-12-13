import express from "express"
const router = express.Router()
import { Product } from "../model/product.js"
import { Category } from "../model/category.js"
import mongoose from "mongoose"
import multer from "multer"
import {join} from "path"
import { __dirname} from '../app.js'


const FILE_TYPE_MAP = {
    "image/png":'png',
    "image/jpg":'jpg',
    "image/jpeg":'jpeg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = join(__dirname,'.', 'public','uploads')
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid file type')
        if(isValid){
            uploadError = null
        }
      cb(uploadError, uploadPath)
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.replace(' ','-')
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/', async (req,res)=>{
    let query = {}
    if(req.query.category){
        query = {category:req.query.category.split(',')}
    }
    try{
        const result = await Product.find(query).populate('category')
        res.send(result)
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.get('/:id', async (req,res)=>{
    try{
        const result = await Product.findById(req.params.id).populate('category') // to show related data
        res.send(result)
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.put('/:id',async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send("Invalid product Id")
    }
    const foundCategory = await Category.findById(req.body.category)
    if(!foundCategory){
        res.status(400).json({message:"Invalid Category"})
    }
    const _id = req.params.id
    const {name,description,richDescription,image,images,brand,
        price,category,countInStock,rating,numReviews,isFeatured} =req.body
    try{
        const replaced = await Product.findByIdAndUpdate(_id,{
            name,
            description,
            richDescription,
            image,
            images,
            brand,
            price,
            category,
            countInStock,
            rating,
            numReviews,
            isFeatured,
        },{new:true})    // when you put it displays old data in postman this prevents that
        res.send(replaced)
    }catch(err){
        res.status(500).json({message:err})
    }
})

router.post('/', upload.single('image'), async(req,res)=>{
    const foundCategory = await Category.findById(req.body.category)
    if(!foundCategory){
        res.status(400).send({message:"Invalid Category"})
    }
    const file = req.file
    if(!file){
        res.status(400).send({message: 'Image not uploaded'})
    }
    const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`
    const {name,description,richDescription,image,images,brand,
        price,category,countInStock,rating,numReviews,isFeatured} =req.body
    const product = new Product({
        name,
        description,
        richDescription,
        image: `${basepath}${req.file.filename}`,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured,
    })
    try{
        const saved = await product.save() 
        if(saved){
            res.send(saved)
        }else{
            res.status(400).json({message:"Err.....product wasnt posted"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.put('/gallery-images/:id',upload.array('images',10),async (req,res)=>{
    const images = []
    const files = req.files
    console.log(files)
    const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`
    if(files){
        files.map(file=> images.push(`${basepath}${file.filename}`))
    }
    try{
        const product = await Product.findByIdAndUpdate(req.params.id,{
            images:images
        },{new:true})
        if(!product){
            res.status(400).send('No products found')
        }
        res.send(product)
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

router.delete('/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const removed = await Product.findByIdAndDelete(_id)
        if(removed){
            console.log("deleted succesffully")
            res.status(200).json({success:true, message:"Succesfully deleted"})
        }else{
            console.log("cant find")
            res.status(400).json({success:false, message:"Error Product not found"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, error:err})
    }
})

router.get('/get/count', async (req,res)=>{
    try{
        const productCount = await Product.countDocuments()
        if(productCount){
            res.send({productCount:productCount})
        }else{
            res.status(500).send("error no product count")
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.get('/get/featured', async (req,res)=>{
    const count = req.params.count ? req.params.count : 0
    try{
        const featured= await Product.find({isFeatured:true},'name isFeatured')
        if(featured){
            res.send(featured)
        }else{
            res.status(500).send("error no featured count")
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

router.get('/get/featured/:count', async (req,res)=>{
    const count = req.params.count ? req.params.count : 0
    try{
        const featured= await Product.find({isFeatured:true},'name isFeatured').limit(+count)
        if(featured){
            res.send(featured)
        }else{
            res.status(500).send("error no featured count")
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
})

export default router;