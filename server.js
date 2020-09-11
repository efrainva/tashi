const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors');
const green = require("greenlock-express")
    .init({
        packageRoot: __dirname,
 
        // contact for security and critical bug notices
        configDir: "./greenlock.d",
 
        // whether or not to run at cloudscale
        cluster: false
    })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(app);

const AWS = require('aws-sdk')
const config = require('./config.js')

app.use(green())
app.use(helmet());
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("running");
});

//  get all students

app.get("/students", async (req, res) => {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'students'
  };
  docClient.scan(params, function(err, data) {
    if (err) {
      res.send({
        success: false,
        message: `server error:${err}`
      });
    } else {
      const { Items } = data;
      res.send({
        success: true,
        message: "Loaded data",
        students: Items
      });
    }
  });
});

// post new students
// id is random 
app.post("/students/add", function(req, res, next) {
    const studentInfo = req.body

  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: config.aws_students,
    Item: {
        studentid: parseInt(Math.random() * 1000),
        name:studentInfo.name,
        score:studentInfo.score,
        subjects:0,
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      res.send({
        success: false,
        message: `Error: Server error: ${err}`
      });
    } else {
      console.log('data', data , studentInfo);      
      res.send({
        success: true,
        message: 'Added students',
        students: data
      });
    }
  });
});

// updates students

app.put('/students/:id', (req, res, next) => {
    const id = req.params.id
    const dataIn = req.body
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: "students",
      Key:{
          "studentid": parseInt(id)
        },
        UpdateExpression: " set score = :score ",
        ExpressionAttributeValues:{
            ":score": dataIn.score,
            // ":name": "jack",
        },
        ReturnValues:"UPDATED_NEW"
    };
    console.log(id,dataIn)
    docClient.update(params, function(err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        res.send({
            success: true,
            message: "Loaded data",
            students: data
          });
        console.log("update succeeded:", JSON.stringify(data, null, 2));
      }
    });
});

// delete students

app.delete("/delete/student/:id", function(req, res, next) {
  const id = req.params.id;
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: "students",
      Key:{
          "studentid":parseInt(id)
        }
  };
  docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("delete succeeded:", JSON.stringify(data, null, 2));
        res.send({
            message:"deleted"
        })
    }
    });
});

// delete subjects

app.delete("/delete/subject/:id", function(req, res, next) {
    const id = req.params.id;
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName: "subjects",
        Key:{
            "subjectid":parseInt(id)
        }
    };
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("delete succeeded:", JSON.stringify(data, null, 2));
            res.send({
                message:"deleted"
            })
        }
    });
});


app.get('/subjects/:id', (req, res, next) => {
    const id = req.params.id
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: "subjects",
      Key:{
          "studentid":id
        },
    };
    docClient.scan(params, function(err, data) {
        const subjects=[]
          // filling subjects require with needed data 
        data.Items.map(e=>{
            if(e.studentid == id){
                subjects.push(e)
            }
        })
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {

        res.send({
            success: true,
            message: "Loaded data",
            subjects: subjects
        });
        console.log("update succeeded:", JSON.stringify(data, null, 2));
      }
    });

});

app.post("/subject/add", function(req, res, next) {
    const studentInfo = req.body

  AWS.config.update(config.aws_remote_config);
  console.log(studentInfo)

  const docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'subjects',
    Item: {
        studentid: studentInfo.studentid,
        subjectid:parseInt(Math.random() * 1000),
        date:studentInfo.date,
        score:studentInfo.score,
        subject:studentInfo.subject,
    }
};

  docClient.put(params, function(err, data) {
    if (err) {
      res.send({
        success: false,
        message: `Error: Server error: ${err}`
      });
    } else {
      console.log('data', data , studentInfo);      
      res.send({
        success: true,
        message: 'Added subjects',
        students: data
      });
    }
  });
});

module.exports = app