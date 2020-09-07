const json = require('./Students.json');
const Course = require('./Course.json');
const CourseOne = require('./CourseOne.json');
const express = require('express')
const cors = require("cors");
const AWS = require('aws-sdk')
const config = require('./config.js')

const app = express()

app.use(express.json())
app.use(cors())
app.get('/',(req,res)=> {
    res.send(json)
})
app.get('/one',async(req,res)=> {

    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: config.aws_dynamodb_table
    };

    docClient.scan(params, function(err, data) {
        if (err) {
          res.send({
            success: false,
            message: 'Error: Server error'
          });
        } else {
          const { Items } = data;
          res.send({
            success: true,
            message: 'Loaded data',
            fruits: Items
          });
        }
      });
    })

    // try{
    //     res.send(Course)
    // }catch(err){
    //     res.status(500).json({error:"error getting data"})
    // }
// })
app.get('/course/2',async(req,res)=> {
    try{
        res.send(CourseOne)
    }catch(err){
        res.status(500).json({error:"error getting data"})
    }
})









module.exports = app