const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const _=require('lodash')
const jwt = require('jsonwebtoken')
const {Student,validate}=require('../models/student')
const {Course} = require('../models/course')
const router = express.Router()

router.get('/',async(req,res)=>{
    const student = await Student.find();
    res.send(student)
})

router.get('/:id',async(req,res)=>{
    const student = await Student.findById(req.params.id)
    if(!student)return res.status(404).send(`Could not find student with ID ${req.prams.id}`)
    res.send(_.pick(student,['_id','name','email','course']))
})

router.post('/',async(req,res)=>{
    const {error} = validate(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    let course = await Course.findById(req.body.courseID)
    if(!course)return res.status(400).send(`Could not find course with ID ${req.body.courseID}`)
    //check if student exist
    let student = await Student.findOne({email:req.body.email})
    if(student)return res.status(400).send('Student already exist')
    student = new Student({
        studentName:req.body.studentName,
        email:req.body.email,
        password:req.body.password,
        course:course
    })
    const salt = await bcrypt.genSalt(10)
    student.password = await bcrypt.hash(req.body.password,salt)
    await student.save()
    const token = jwt.sign({_id:student._id},'jwtPrivateKey')
    res.header('x-auth-token',token).send(_.pick(student,["_id","name","email","course"]))
})

router.put('/:id',async(req,res)=>{
    const {error}= validate(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    const student = await Student.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            studentName:req.body.studentName,
            email:req.body.email,
            password:req.body.password
        }
    },{new:true})
    if(!student)return res.send(`could not find student with ID ${req.params.id}`).status(404)
    const token = await 
    res.send(_.pick(student,["_id","name","email"]))
})

router.delete('/:id',async(req,res)=>{
    const student = await Student.findByIdAndRemove(req.params.id)
    if(!student)return res.status(404).send(`Could not find Student with ID ${req.params.id}`)
    res.send(_.pick(student,["_id","name","email"]))
})

module.exports = router