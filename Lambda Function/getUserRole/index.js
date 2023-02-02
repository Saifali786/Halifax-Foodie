//References : https://gist.github.com/dfbq91/da80607e23330ca082c30d6574c74fb1
//References: https://medium.com/hackernoon/how-to-add-new-cognito-users-to-dynamodb-using-lambda-e3f55541297c

const AWS = require('aws-sdk'); // Load the AWS SDK for Node.js
const db = new AWS.DynamoDB();


exports.handler = async (event, context) => {
    let responseBody = "";
    let statusCode = 0;
    console.log(event);
    const tableName = "userdetails";
    const region = "us-east-1";
    console.log(event.body);
    const email = JSON.parse(event.body).email;
    console.log(email);

    console.log("table=" + tableName + " -- region=" + region);

    AWS.config.update({region: region});

    var params = {
    TableName: tableName,
    Key: {
    'email': {S: email}
    }
    
};

try {
    
        const data = await db.getItem(params).promise();
        responseBody = JSON.stringify(data.Item.role.S);
        statusCode = 200;
    } catch (error) {
        responseBody = `Email does not exist`;
        statusCode = 200;
    }
    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json"
            
        },
        body: responseBody
    };

    return response;
};

