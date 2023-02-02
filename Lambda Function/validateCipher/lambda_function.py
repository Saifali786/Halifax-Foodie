# References : [1] http://www.crypto-it.net/eng/simple/columnar-transposition.html
# References : [2] https://medium.com/accenture-the-dock/serverless-api-with-aws-and-python-tutorial-3dff032628a7
# References : [3] https://docs.amplify.aws/guides/functions/dynamodb-from-python-lambda/q/platform/js/#querying-a-table

import json
import boto3
import math

client = boto3.client("dynamodb")


def lambda_handler(event, context):
    print(event)
    user_cipher = json.loads(event["body"])["cipher"]
    email = json.loads(event["body"])["email"]
    print(user_cipher)
    print(email)
    try:
        client = boto3.client("dynamodb") 
        response = client.get_item(
            TableName="cipherDetails", Key={"email": {"S": str(email)}}
        )
        print(response)
        emailFromDB = response.get("Item").get("email").get("S")
        print(emailFromDB)
        if email == emailFromDB:
            key = response.get("Item").get("key").get("S")
            plain_text = response.get("Item").get("plainText").get("S")
            print(key)
            print(plain_text)
            cipher = ""
            cipher = encrypt(plain_text, key)
            print(cipher)
            print(user_cipher)

            if cipher == user_cipher:
                return {
                    "statusCode": 200,
                    "body": json.dumps({"Message": "Cipher is correct"}),
                }
            else:
                return {" statusCode": 200, "body": "Incorrect cipher text"}
    except:
        return {
            "statusCode": 200,
            "body": json.dumps("No record exist in the database"),
        }


def encrypt(message, keyword):
    matrix = createEncMatrix(len(keyword), message)
    keywordSequence = getKeywordSequence(keyword)

    ciphertext = ""
    for num in range(len(keywordSequence)):
        pos = keywordSequence.index(num + 1)
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
