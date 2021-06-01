const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {validate,Lecturer} = require('../models/lecturer')
const _=require('lodash')
const router = express.Router()

router.get('/',async(req,res)=>{
    const lecturers = await Lecturer.find()
    res.send(lecturers)
})

router.get('/:id',async(req,res)=>{
    const lecturer = await Lecturer.findById(req.params.id)
    if(!lecturer)return res.status(404).send(`could not find lecturer with ID ${req.params.id}`)
    res.send(_.pick(lecturer,['_id','name','email']))
})

router.post('/',async(req,res)=>{
    const {error} = validate(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    //find if lecturer already exists
    let lecturer = await Lecturer.findOne({email:req.body.email})
    if(lecturer)return res.send('Lecturer already exists').status(400)
    lecturer = new Lecturer(_.pick(req.body,["name","email","password"]))
    const salt = await bcrypt.genSalt(10)
    lecturer.password = await bcrypt.hash(lecturer.password,salt)
    await lecturer.save()
    res.send(_.pick(lecturer,['_id','name','email']))
})

router.put('/:id',async(req,res)=>{
    const {error} = validate(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    const lecturer = await Lecturer.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }
    },{new:true})
    if(!lecturer)return res.send(`Could not find Lecturer with ID ${req.params.id}`).send(404)
    res.send(_.pick(lecturer,['_id','name','email']))
})

router.delete('/:id',async(req,res)=>{
    const lecturer = await Lecturer.findByIdAndRemove(req.params.id)
    res.send(_.pick(lecturer,['name','email']))
})

module.exports = router
