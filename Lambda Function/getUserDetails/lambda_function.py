# Reference : https://www.shedloadofcode.com/blog/creating-your-own-website-analytics-solution-with-aws-lambda-and-google-sheets
import json
import gspread
gc = gspread.service_account(filename='google_service_account_credentials.json')
gsheet = gc.open("Login Analytics")


def lambda_handler(event, context):
    print(event);
    request_body = json.loads(event["body"])
    print(request_body)
    email = json.loads(event['body'])['email']
    day = json.loads(event['body'])['day']
    month = json.loads(event['body'])['month']
    year = json.loads(event['body'])['year']
    write_events_to_google_sheet(day, month, year)

    return { 
        "statusCode": 200,
        "body": json.dumps("User record saved"),
    }
    

def write_events_to_google_sheet(day, month, year):
    row = [
            day,
            month, 
            year, 
        ]
        
    gsheet.sheet1.insert_row(row, index=2)
        
 