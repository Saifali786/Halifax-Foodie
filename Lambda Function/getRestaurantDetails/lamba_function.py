# Reference : https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    dynamo_db = boto3.resource('dynamodb')
    table = dynamo_db.Table('userdetails')
    restaurant_list = []
    # Get all users whose role is owner
    response = table.scan(FilterExpression=Attr('role').eq("Owner"))
    print(response);
    if response['Count'] == 0:
       return{
        'statusCode': 200,
        'body': json.dumps('No record exist in the database')
       }
    else:
        restaurant_details = []
        items = response['Items']
    for item in items:
        restaurant_name = item['name'];
        restaurant_email = item['email'];
        polarity_map = {'restaurant_email_id': restaurant_email, 'name': restaurant_name} 
        restaurant_details.append(polarity_map) #Add restaurant details to the list
    
    return{
            'statusCode' : 200,
            'body' : json.dumps(restaurant_details)
        }

