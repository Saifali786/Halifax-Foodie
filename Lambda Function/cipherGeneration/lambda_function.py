# References : [1] http://www.crypto-it.net/eng/simple/columnar-transposition.html
# References : [2] https://medium.com/accenture-the-dock/serverless-api-with-aws-and-python-tutorial-3dff032628a7
# References : [3] https://docs.amplify.aws/guides/functions/dynamodb-from-python-lambda/q/platform/js/#querying-a-table

import json
import boto3
import math
import base64

def encrypt(message, keyword):
  matrix = createEncMatrix(len(keyword), message)
  keywordSequence = getKeywordSequence(keyword)

  ciphertext = "";
  for num in range(len(keywordSequence)):
    pos = keywordSequence.index(num+1)
    for row in range(len(matrix)):
      if len(matrix[row]) > pos:
        ciphertext += matrix[row][pos]
  return ciphertext


def createEncMatrix(width, message):
  r = 0
  c = 0
  matrix = [[]]
  for pos, ch in enumerate(message):
    matrix[r].append(ch)
    c += 1
    if c >= width:
      c = 0
      r += 1
      matrix.append([])

  return matrix


def getKeywordSequence(keyword):
  sequence = []
  for pos, ch in enumerate(keyword):
    previousLetters = keyword[:pos]
    newNumber = 1
    for previousPos, previousCh in enumerate(previousLetters):
      if previousCh > ch:
        sequence[previousPos] += 1
      else:
        newNumber += 1
    sequence.append(newNumber)
  return sequence

def lambda_handler(event, context):
  
    keyword = json.loads(event['body'])['key']
    email = json.loads(event['body'])['email']
    message = json.loads(event['body'])['text']
    
    cipher = encrypt(message, keyword)
  
    
    dynamodb = boto3.resource('dynamodb')
    client = boto3.client('dynamodb')

    dynamodb = boto3.resource('dynamodb')

    #table name
    table = dynamodb.Table('cipherDetails')

    #inserting values into table
    try:
        table.put_item(
          Item={
                'email': email,
                'key': keyword,
                'plainText': message
            }
        )
        return {
        'statusCode': 200,
        'body': json.dumps({"cipher": cipher})
        }
    except:
        print('Closing lambda function')
        return {
                'statusCode': 400,
                'body': json.dumps('Error saving the record')
        }   
    
    





        
    

