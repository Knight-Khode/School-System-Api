const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi')

const lecturerSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:5,
        maxlength:255,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:5,
        maxlength:255,
        required:true
    }
})

const Lecturer = mongoose.model('Lecturer',lecturerSchema)

const validate = (lecturer)=>{
    const schema = Joi.object({
        name:Joi.string().min(5).max(255).required(),
        email:Joi.string().required(),
        password:Joi.string().min(5).max(255).required()
    })

    return schema.validate(lecturer)
}

exports.Lecturer = Lecturer
exports.validate=validate