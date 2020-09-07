module.exports = {
    aws_dynamodb_table: 'tashi_be',
    // aws_local_config: {
    //   region: 'local',
    //   endpoint: 'http://localhost:8000'
    // },
    aws_remote_config: {
        accessKeyId: proccess.env.AWS_KEY_ID,
        secretAccessKey: proccess.env.AWS_ACCESS_KEY,
        region: 'us-east-2',
      }
  };

//   us-east-2