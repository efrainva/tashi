const json = require('./Students.json');
const Course = require('./Course.json');
const CourseOne = require('./CourseOne.json');
const express = require('express')
const cors = require("cors");

const app = express()

app.use(express.json())
app.use(cors())
app.get('/',(req,res)=> {
    res.send(json)
})
app.get('/course/1',async(req,res)=> {
    try{
        res.send(Course)
    }catch(err){
        res.status(500).json({error:"error getting data"})
    }
})
app.get('/course/2',async(req,res)=> {
    try{
        res.send(CourseOne)
    }catch(err){
        res.status(500).json({error:"error getting data"})
    }
})

module.exports=app