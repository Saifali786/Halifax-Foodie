# Reference : https://www.shedloadofcode.com/blog/creating-your-own-website-analytics-solution-with-aws-lambda-and-google-sheets
# Reference : https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
import json
import gspread
import boto3
from boto3.dynamodb.conditions import Attr
gc = gspread.service_account(filename='credentials.json')
gsheet = gc.open("Recipe Analytics")
sheet1 = gsheet.sheet1

def lambda_handler(event, context):
    print(event)
    print(event['body'])
    dynamoDb = boto3.resource('dynamodb')
    table = dynamoDb.Table('recipes')
    comprehend = boto3.client("comprehend")
    email = json.loads(event['body'])['email'];
    print(email)
    response = table.scan();
    print(response)
    
    items = response['Items']
    print(items)
    if response['Count'] == 0:  #if response count is zero return with a message 
          return{
            'statusCode': 200,
            'body': json.dumps('No recipe exists')
          }
    else:
        sheet1.delete_rows(2, 42) #Deleting already filled details every time the lambda is triggered
        my_list = []
        for item in items:
            l = item["email"]
            if(email == l):
                recipeName = item["recipeName"]
                recipeMap = {'recipe_name' : recipeName, 'day' : item['day'], 'month' : item['month'], 'year': item['year'] }
                my_list.append(recipeMap)
            else:
                continue
        print(my_list)        
        write_events_to_google_sheet(my_list)
        return { 
            "statusCode": 200,
            "body": json.dumps("Recipe saved in google sheets"),
        } 
    

def write_events_to_google_sheet(my_list):
    for recipes in my_list:
        recipeName = recipes['recipe_name'];
        print(recipeName)
        day = recipes['day'];
        print(day)
        month = recipes['month'];
        print(month)
        year = recipes['year'];
        print(year)
        row = [recipeName, day, month, year ]
        print(row)
        sheet1.insert_row(row, index = 2)
        
        
        
        
    
   
          
 