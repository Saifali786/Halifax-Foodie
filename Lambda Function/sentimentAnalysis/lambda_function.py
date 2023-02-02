# Reference: https://github.com/srcecde/aws-tutorial-code/blob/master/lambda/lambda_comprehend.py
# Reference : https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
import boto3
from boto3.dynamodb.conditions import Attr
import json

import gspread
gc = gspread.service_account(filename='credentials.json')
gsheet = gc.open("Polarity Analytics")
sheet1 = gsheet.sheet1

def lambda_handler(event, context):
    print(event);
    email = json.loads(event['body'])['email'];
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('feedback')
    comprehend = boto3.client("comprehend")
    customer_polarity = []
    
    res = table.scan(FilterExpression=Attr('email').eq(email))
    if res['Count'] == 0:
           return{
            'statusCode': 200,
            'body': json.dumps('No record exists for the user')
           }
    else:
        sheet1.delete_rows(2, 42)
        items = res['Items'];
        for item in items:
            user_feedback = item["feedback"]
            sentiment = comprehend.detect_sentiment(Text = user_feedback, LanguageCode = "en")
            print(sentiment)
            print(sentiment['Sentiment'])
            map = {'feedback': user_feedback, 'sentiment': sentiment['Sentiment']}
            customer_polarity.append(map)
            
        print(customer_polarity)        
        write_events_to_google_sheet(customer_polarity)    
            
        return{
            'statusCode' : 200,
            'body' : json.dumps(customer_polarity)
        }
def write_events_to_google_sheet(polarity):
    print(polarity)
    for item in polarity:
        feedback = item['feedback']
        sentiment = item['sentiment'];
        
        row = [feedback, sentiment]
            
        gsheet.sheet1.insert_row(row, index=2)
        