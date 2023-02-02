// References: https://medium.com/hackernoon/how-to-add-new-cognito-users-to-dynamodb-using-lambda-e3f55541297c

var aws = require('aws-sdk');
var ddb = new aws.DynamoDB();

exports.handler = async (event, context, callback) => {
    console.log(event);
    const tableName = "userdetails";
    const region = "us-east-1";
    aws.config.update({region: region});
    
    if (event.request.userAttributes.sub) {
        //  User details like name, email fetched from request and store in params lists.
        let ddbParams = {
            Item: {
                'name': {S: event.request.userAttributes.name},
                'email': {S: event.request.userAttributes.email},
                'role': {S: event.request.userAttributes['custom:role']},
                'password' : {S: event.request.userAttributes['custom:password']}
            },
            TableName: tableName
        };

        // Call Dynamo DB to store data in Dynamo DB
        try {
            await ddb.putItem(ddbParams).promise();
            console.log("Success");
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Success ");
        context.done(null, event);

    } else {
        
        console.log("Error: No write operation performed in DynamoDB");
        context.done(null, event);
    }
};