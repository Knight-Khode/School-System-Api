const express = require("express")
const Joi = require("joi")
const mongoose = require("mongoose")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {Student} = require("../models/student")

router.post('/',async(req,res)=>{
    const {error}=validate(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    //check student email
    const student = await Student.findOne({email:req.body.email})
    if(!student)return res.status(400).send('Invalid email and password')
    //check student password
    const validPassword = await bcrypt.compare(req.body.password,student.password)
    if(!validPassword)return res.status(400).send('Invalid email and password')
    const token = jwt.sign({_id:student._id},'jwtPrivateKey')
    res.send(token)
})
   

function validate(req){
    const schema = Joi.object({
        email:Joi.string().required(),
        password:Joi.string().min(5).max(255).required()
    })

    return schema.validate(req)
}

module.exports = router