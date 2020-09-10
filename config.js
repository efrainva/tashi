require("dotenv").config();

module.exports = {
    aws_students: "students",
    aws_subjects: "subjects",

    aws_remote_config: {
        accessKeyId: process.env.AWS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY,
        region: "us-east-2",
        // endpoint: "https://us-east-2.aws.amazon.com"
    },

  };

//   us-east-2