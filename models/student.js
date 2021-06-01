const mongoose = require('mongoose')
const Joi = require("joi")
const {courseSchema} = require('./course')

const studentSchema =new mongoose.Schema({
    studentName:{
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
        required:true,
        minlength:5,
        maxlength:255
    },
    course:courseSchema
})

const Student = mongoose.model('Student',studentSchema)

const validate = (student)=>{
    const schema = Joi.object({
        studentName:Joi.string().min(5).max(255).required(),
        email:Joi.string().required(),
        password:Joi.string().min(5).max(255).required(),
        courseID:Joi.string().required()
    })

    return schema.validate(student)
}

exports.validate=validate
exports.Student = Student