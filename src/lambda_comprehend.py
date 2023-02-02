import boto3
from pprint import pprint

'''
@author Meet Master
'''
#References - https://github.com/srcecde/aws-tutorial-code/blob/master/lambda/lambda_comprehend.py

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    bucket = "g6-data-processing-v2"
    key = "filename.txt"
    file = s3.get_object(Bucket=bucket, Key=key)
    paragraph = str(file["Body"].read())

    comprehend = boto3.client("comprehend")

    # Extracting entities using comprehend
    entities = comprehend.detect_entities(Text=paragraph, LanguageCode="en")
    pprint(entities)