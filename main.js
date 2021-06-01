const express = require('express');
const mongoose = require('mongoose');
const lecturers = require('./routes/lecturers')
const courses = require('./routes/courses')
const app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost/school',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>console.log('Connected to mongodb...'))
.catch((err)=>console.error('could not connect to mongodb...',err))

app.use('/api/lecturers',lecturers)
app.use('/api/courses',courses)

const port = process.env.PORT || 4000
app.listen(port,()=>{console.log(`Listening to port ${port}...`)})