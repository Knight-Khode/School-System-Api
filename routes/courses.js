const express = require('express')
const mongoose = require('mongoose')
const _=require('lodash')
const bcrypt = require('bcrypt')
const {Course,validate}= require('../models/course')
const { Lecturer } = require('../models/lecturer')
const router = express.Router()

router.get('/',async(req,res)=>{
    const courses = await Course.find()
    res.send(courses)
})

router.get('/:id',async(req,res)=>{
    const course = await Course.findById(req.params.id)
    if(!course)return res.status(404).send(`Couldnot find course with ID ${req.params.id}`)
    res.send(course)
})

router.post('/',async(req,res)=>{
    const {error} = validate(req.body)
    if(error)return res.status(400).send(error.details[0].mesasage)
    let lecturer = await Lecturer.findById(req.body.lecturerID)
    if(!lecturer)return res.status(404).send(`Could not find Lecturer with ID ${req.body.lecturer}`)
    let course = await Course.findOne({courseName:req.body.courseName})
    course = new Course({
        courseName: req.body.courseName,
        duration:req.body.duration,
        lecturer:lecturer
    })
    await course.save()
    res.send(course)
})

router.put('/:id',async(req,res)=>{
    let lecturer = await Lecturer.findById(req.body.lecturerID)
    if(!lecturer)return res.status(404).send(`Could not find Lecturer with ID ${req.body.lecturer}`)
    const course = await Course.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            courseName:req.body.courseName,
            duration:req.body.duration,
            lecturer:lecturer
        }
    },{new:true})

    res.send(course)
})

router.delete('/:id',async(req,res)=>{
    const course = await Course.findByIdAndRemove(req.params.id)
    if(!course)return res.send(`Could not find Course with ID ${req.params.id}`)
    res.send(course)
})

module.exports = router