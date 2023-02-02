# Reference : https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
import boto3
import json
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('feedback')

def lambda_handler(event, context):
    print(event);
    email = json.loads(event['body'])['email']
    print(email)
    name = json.loads(event['body'])['name']
    print(name)
    feedback = json.loads(event['body'])['feedback']
    print(feedback)
    id = json.loads(event['body'])['id']
    print(id)
    try:
        table.put_item(Item={'id': id,'email': email,'feedback':feedback,
            })
        return{
        'statusCode': 200,
        'body': json.dumps('Success')
        }
    except:
        return{
        'statusCode' : 200,
        'body' : json.dumps('Error')
        }
