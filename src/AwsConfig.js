import AWS from 'aws-sdk'

/**
 * @author Meet Master
 */


const S3_BUCKET = 'g6-data-processing-v2'//process.env.REACT_APP_AWS_S3_BUCKET;
const REGION = 'us-east-1'//process.env.REACT_APP_AWS_REGION;
const DYANMODB_TABLE = 'namedEntities'//process.env.REACT_APP_AWS_DYNAMODB_TABLE;

const AwsConfig =   
    AWS.config.update({
        accessKeyId: 'AKIAVILLJ4WSLRPRMSMZ',//process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: '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' //process.env.REACT_APP_SECRET_ACCESS_KEY
       // sessionToken: 'FwoGZXIvYXdzELv//////////wEaDEy2FggXhpVVq6+SyiLAAaRgd3uA85tgAlYgsgUFx8nOx8aWL56nFq+NmZvoJdDBLI5NO4rfaVfM5TY/oeVpJLRBKzhkTLXRulitgsbrJVtpsvOXMSsLERYfI7NjebyqUB+o/p502BxwPTDsURYQvReMjxHljDZhKdMsRqmy+BFiyE/XqnxFfIQGd6zvpBS7Sz45HljgF5SPP1q8wGsfWMS15RmU1TI/nK5Iu87f+XFGC9pnudoGrIZNvvmkqPbeIdrnrJoCgAg92fMnr6d7pCjKna6cBjIt/D83uRjPL5FCy75wZxt4/q92IgYFKUI5sKC2sv95JCOgE0tpfO0zeJOMClz9'//process.env.REACT_APP_SESSION_TOKEN
    })

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: process.env.REACT_APP_AWS_REGION,
})

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: REGION  
})

export {S3_BUCKET,  DYANMODB_TABLE, dynamoDb, REGION, AwsConfig, myBucket}