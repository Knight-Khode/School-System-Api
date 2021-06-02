const mongoose = require('mongoose')
const Joi = require("joi")
const {lecturerSchema} = require('./lecturer')

const courseSchema =new mongoose.Schema({
    courseName:{
        type:String,
        minlength:5,
        maxlength:255,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    lecturer:lecturerSchema
})

const Course = mongoose.model('Course',courseSchema)

const validate = (course)=>{
    const schema = Joi.object({
        courseName:Joi.string().min(5).max(255).required(),
        duration:Joi.number().required(),
        lecturerID:Joi.string()
    })

    return schema.validate(course)
}

exports.Course = Course
exports.validate = validate
exports.courseSchema = courseSchema