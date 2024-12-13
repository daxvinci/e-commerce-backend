import express from "express"
import 'dotenv/config'
import bodyParser from "body-parser"
import productRoutes from "./routes/products.js"
import userRoutes from "./routes/users.js"
import orderRoutes from "./routes/orders.js"
import categoryRoutes from "./routes/categories.js"
import mongoose from "mongoose"
import jwtMiddleware from "./helper/jwt.js"
import handleErrors from "./helper/errorHandlers.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// Get the current directory (workaround for __dirname)
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(jwtMiddleware())
app.use('/public/uploads',express.static(join(__dirname,'public','uploads')))
app.use(handleErrors)

mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(()=>{
    console.log("succesfully connected to database")
})
.catch((err)=>{
    console.log(err)
})

app.get('/', (req,res)=>{
    res.send("hello server")
})

app.use('/products',productRoutes)
app.use('/users',userRoutes)
app.use('/orders',orderRoutes)
app.use('/categories',categoryRoutes)

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})