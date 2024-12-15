const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

app.use('/vendors', require("./routes/VendorsRoutes"));
app.use('/products', require('./routes/ProductsRoutes'));
app.use('/orders', require("./routes/OrderRoutes"));
// Mongoose Connection 
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected Successfully'))
.catch(err => console.log(err));


app.listen(process.env.PORT, (error)=>{
    if(error){
        console.log(error);
    }else{
        console.log(`Server has started at PORT ${process.env.PORT}`);
    }
})