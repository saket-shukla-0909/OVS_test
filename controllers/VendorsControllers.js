const Vendor = require("../modals/VendorsModal");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// Vendor Registeration api
exports.vendorRegister = async(req, res)=>{
    try{    
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            res.status(401).send('All fields are mandatory')
        }

        const vendorExist = await Vendor.findOne({email: email});
        if(vendorExist){
            res.status(402).send('Email already exist!')
        }else{
            // Token creation at Vendor registeration
                const token = jwt.sign(
                    {email: email},
                    process.env.SECRET_KEY,
                    {expiresIn: '24h'}
                )
            // Password encryption using bcrypt library
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt)
            const vendorData = {
                name:name,
                email:email,
                password: hashPassword,
                token: token
            }

            const vendor = new Vendor(vendorData);
            vendor.save();
            res.status(200).send({success:true, message:'Vendor has successfully registered', vendor})
        }
    }catch(error){
        console.log(error);
        res.status(500).send('Internal server error');
    }
}



exports.vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).send('All fields are mandatory');
        }

        // Check if vendor exists
        const vendorExist = await Vendor.findOne({ email:email});
        if (!vendorExist) {
            return res.status(404).send('Vendor does not exist!');
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, vendorExist.password);
        if (!isPasswordMatch) {
            return res.status(401).send('Password did not match');
        }

        const token = jwt.sign(
            {email: email},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
        vendorExist.token = token;
        vendorExist.save();
        // Successful login
        res.status(200).send({ success: true, message: 'Vendor has logged in successfully', vendorExist,});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
