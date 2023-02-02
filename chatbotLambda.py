import json
import boto3
import time
import os
import random
import string
import urllib3

http = urllib3.PoolManager()
client = boto3.client('dynamodb')
result = {}
invalidResponse={}
intent=[]
User=""


def get_chat_id(length):
    letters = string.ascii_lowercase
    chat_id = ''.join(random.choice(letters) for i in range(length))
    return chat_id
   

def lambda_handler(event, context):
    print("event=====>")
    print(event)
    session=event['sessionState']
    print(event['sessionState'])
    intentname=event['interpretations'][0]['intent']['name']

    
    #routing with intent names
    #validate intent
    if(intentname=='Validate'):
        UserName=session['intent']['slots']['name']['value']['originalValue']
        UserEmail=session['intent']['slots']['email']['value']['originalValue']
        result=validate(UserName,UserEmail)
        return result
        
    #RateOrder intent  
    if(intentname=='RateOrder'):
        OrderID=session['intent']['slots']['order_ID']['value']['originalValue']
        print("OrderID--->",OrderID)
        OrderRating=session['intent']['slots']['order_rating']['value']['originalValue']        
        result=rateorder(OrderID,OrderRating)
        return result
        
    #Trackorder intent    
    if(intentname=='Trackorder'):
        OrderID=session['intent']['slots']['orderID']['value']['originalValue']
        result=TrackOrder(OrderID)
        return result  
        
    #validateOwner intent     
    if(intentname=='validateOwner'):
        ownerName=session['intent']['slots']['ownerName']['value']['originalValue']
        ownerEmail=session['intent']['slots']['ownerEmail']['value']['originalValue']
        result=validateOwner(ownerName,ownerEmail)
        return result    
        
    #Adding recipes
    if(intentname=='AddRecipes'):
        resID=session['intent']['slots']['resID']['value']['originalValue']
        recipeName = session['intent']['slots']['recipename']['value']['originalValue']
        recipePrice = session['intent']['slots']['recipeprice']['value']['originalValue']
        recipeIngredients = session['intent']['slots']['ingredients']['value']['originalValue']
        result = AddingRecipes(resID,recipeName,recipePrice,ingredients)
        return result
        
        
    #Customer_Complaints intent    
    if(intentname=='Customer_Complaints'):        
        OrderID=session['intent']['slots']['orderID']['value']['originalValue']
        UserEmail=session['intent']['slots']['email']['value']['originalValue']
        UserData=client.get_item(TableName='userDetails',Key={'email':{'S':UserEmail}})
        UserName=UserData['Item']['name']['S']
        OrderDetails=client.get_item(TableName='orders',Key={'order_Id':{'N':OrderID}})
        Restaurant_ID=OrderDetails['Item']['restaurant_id']['S']
        RestaurantDetails=client.get_item(TableName='restaurant',Key={'restaurant_id':{'S':Restaurant_ID}})
        Restaurant_Email=RestaurantDetails['Item']['restaurant_email']['S']
        RestaurantName=RestaurantDetails['Item']['restaurant_name']['S']
        message="You can now chat with the owner of:"+RestaurantName
        order = {}
        chatID=str(int(time.time()*1000))
        order["chatID"]=chatID
        order["userEmail"]= UserEmail
        order["userName"]= UserName
        order["restaurantEmail"]= Restaurant_Email
        order["restaurantName"]= RestaurantName
        #cloud function module
        myurl='https://us-central1-csci-5410-f2022.cloudfunctions.net/pushMessage'
        response = http.request('POST',myurl,
        body = json.dumps(order), headers = {'Content-Type': 'application/json'},
        retries= False)
        print(response)            
        messageurl=f"chat initated with owner on the url:localhost:3000/chat/{chatID}"
        complaintResponse = {
            
             "sessionState":{
            "dialogAction": {
            "type": "Close",
            },
            "intent":{
                "name" : "Customer_Complaints",
                "state": "Fulfilled",
                    }
            },
            "messages": [{
            "contentType": "PlainText",
            "content": messageurl
            }]
          }
        return complaintResponse
        
 
 
 #function for validating owner credentials 
 
def validateOwner(ownerName,ownerEmail):
    data=client.get_item(
        TableName='restaurantOwners',
        Key={
            'ownerEmail':{
                'S':ownerEmail
            }
            
        })
    myDict=data
    if(('Item' in myDict.keys()) and (ownerEmail == myDict['Item']['ownerEmail']['S']) and (ownerName ==myDict['Item']['ownerName']['S'])):
        msg="verified now you can add recipes type add recipe to add"
        message=''.join(msg)
        result = {
                "sessionState":{
                "dialogAction": {
                "type": "Close",
                 },
                "intent":{
                    "name":"validateOwner",
                    "state": "Fulfilled",
                }
                }
                # "messages": [{
                #   "contentType": "PlainText",
                #   "content": message
                # }]
                
            }
        print(result)
        return result
    else:
        message="sorry invalid owner details"
        result = {
            
             "sessionState":{
            "dialogAction": {
            "type": "Close",
            },
            "intent":{
                "name" : "validateOwner",
                "state": "Fulfilled",
                    }
            },
            "messages": [{
            "contentType": "PlainText",
            "content": message
            }]
          }
        print(result)
        return result
        

        

 #function for Adding recipes 
 
def AddingRecipes(resID, recipeName, recipePrice,ingredients):
    response = client.put_item(TableName = 'recipe',Item={'restaurant_email':{'S':resID},'recipeName':{'S':recipeName},'recipePrice':{'S':recipePrice},'ingredients':{'S':ingredients}})
    msg='Successfully Added recipe '
    result = {
            "sessionState":{
            "dialogAction": {
            "type": "Close",
             },
            "intent":{
                "name":"AddRecipes",
                "state": "Fulfilled",
            }
            }
            # "messages": [{
            #   "contentType": "PlainText",
            #   "content": msg
            # }]
        }
    print(result)
    return result    


#function for rate the order 
def rateorder(orderId,rating):
    OrderDetails=client.get_item(TableName='orders',Key={'order_Id':{'N':orderId}})
    rateTable=client.update_item(TableName='orders',Key={'order_Id':{'N':orderId}},UpdateExpression="SET order_rating = :userRating",ExpressionAttributeValues={':userRating':{'N':rating}},ReturnValues="UPDATED_NEW") 
    msg='Thanks for rating '
    result = {
            "sessionState":{
            "dialogAction": {
            "type": "Close",
             },
            "intent":{
                "name":"Validate",
                "state": "Fulfilled",
            }
            },
            "messages": [{
              "contentType": "PlainText",
              "content": msg
            }]
        }
    print(result)
    return result

#function for tracking order
def TrackOrder(orderId):
    OrderDetails=client.get_item(TableName='orders',Key={'order_Id':{'N':orderId}})
    orderStatus=OrderDetails['Item']['order_status']['S']
    print(orderStatus)
    if(orderStatus=='preparing food'):
        msg='Dont worry your food is being prepared will reach you after its done'
    else:
        msg='Delivery guy picked your order it will reach you soon'
    result = {
            "sessionState":{
            "dialogAction": {
            "type": "Close",
             },
            "intent":{
                "name":"Trackorder",
                "state": "Fulfilled",
            }
            },
            "messages": [{
              "contentType": "PlainText",
              "content": msg
            }]
        }
    print(result)
    return result

#function for validating user

def validate(UserName,UserEmail):
    data=client.get_item(
        TableName='userDetails',
        Key={
            'email':{
                'S':UserEmail
            }
            
        })
    myDict=data
    role=data['Item']['role']['S']
    
    if(('Item' in myDict.keys()) and (UserEmail == myDict['Item']['email']['S']) and (UserName ==myDict['Item']['name']['S'])and(data['Item']['role']['S']=="Owner")):
        msg="HEllO Owner I can help you with adding recipes To start type AddRecipes or ADD"
        print("you are in user role case ")
        message=''.join(msg)
        result = {
                "sessionState":{
                "dialogAction": {
                "type": "Close",
                 },
                "intent":{
                    "name":"Validate",
                    "state": "Fulfilled",
                }
                },
                "messages": [{
                  "contentType": "PlainText",
                  "content": message
                }]
                
            }
        print(result)
        return result
        
    elif(('Item' in myDict.keys()) and (UserEmail == myDict['Item']['email']['S']) and (UserName ==myDict['Item']['name']['S'])):
        msg="you are verified"
        print("you are in user case ")
        message=''.join(msg)
        result = {
                "sessionState":{
                "dialogAction": {
                "type": "Close",
                 },
                "intent":{
                    "name":"Validate",
                    "state": "Fulfilled",
                }
                }
                # "messages": [{
                #   "contentType": "PlainText",
                #   "content": msg
                # }]
                
            }
        print(result)
        return result
    elif (('Item' in myDict.keys()) and (UserEmail == myDict['Item']['email']['S']) and (UserName != myDict['Item']['name']['S'])):
        msg="Please verify your details and try again !"
        message=''.join(msg)
        result = {
                "sessionState":{
                "dialogAction": {
                "type": "Close",
                 },
                "intent":{
                    "name":"Validate",
                    "state": "Fulfilled",
                }
                },
                "messages": [{
                  "contentType": "PlainText",
                  "content": msg
                }]
            }
        print(result)
        return result
    else:
        message="sorry you are not registered, signup to use all the services"
        result = {
            
             "sessionState":{
            "dialogAction": {
            "type": "Close",
            },
            "intent":{
                "name" : "Validate",
                "state": "Fulfilled",
                    }
            },
            "messages": [{
            "contentType": "PlainText",
            "content": message
            }]
          }
        print(result)
        return result
        
        
'''      
References

[1]	“Update an item in a DynamoDB table,” Amazonaws.cn. [Online]. Available: https://docs.amazonaws.cn/en_us/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html. [Accessed: 04-Dec-2022].
[2]	“DynamoDB — Boto3 Docs 1.26.22 documentation,” Amazonaws.com. [Online]. Available: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html. [Accessed: 04-Dec-2022].
[3]	“Google-cloud-firestore,” PyPI. [Online]. Available: https://pypi.org/project/google-cloud-firestore/. [Accessed: 04-Dec-2022].
[4]	Amazon.com. [Online]. Available: https://docs.aws.amazon.com/sns/latest/dg/sns-using-identity-based-policies.html. [Accessed: 04-Dec-2022].
[5]	“Google-cloud-pubsub,” PyPI. [Online]. Available: https://pypi.org/project/google-cloud-pubsub/. [Accessed: 04-Dec-2022].
[6]	L. Kwong, “How to use Google Pub/Sub to build an asynchronous messaging system in Python,” Level Up Coding, 13-Jan-2022. [Online]. Available: https://levelup.gitconnected.com/how-to-use-google-pub-sub-to-build-an-asynchronous-messaging-system-in-python-3b43094627dc. [Accessed: 04-Dec-2022].
[7]	Amazon.com. [Online]. Available: https://policysim.aws.amazon.com/home/index.jsp#users. [Accessed: 04-Dec-2022].
[8]	Amazon.com. [Online]. Available: https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html. [Accessed: 04-Dec-2022].
[9]	“Adding data,” Google Cloud. [Online]. Available: https://cloud.google.com/firestore/docs/manage-data/add-data. [Accessed: 04-Dec-2022].
[10]	Amazon.com. [Online]. Available: https://docs.aws.amazon.com/lexv2/latest/dg/paths-nextstep.html. [Accessed: 04-Dec-2022].
[11]	Amazon.com. [Online]. Available: https://docs.aws.amazon.com/lexv2/latest/dg/session-attribs-speech.html. [Accessed: 04-Dec-2022].
[12]	“Add data to cloud firestore,” Firebase. [Online]. Available: https://firebase.google.com/docs/firestore/manage-data/add-data. [Accessed: 04-Dec-2022].
[13]	Amazon.com. [Online]. Available: https://docs.aws.amazon.com/lex/latest/dg/ex-resp-card.html. [Accessed: 04-Dec-2022].
[14]	Amazon.com. [Online]. Available: https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-integrating-microservices/pub-sub.html. [Accessed: 04-Dec-2022].
[15]	“Publish messages to topics,” Google Cloud. [Online]. Available: https://cloud.google.com/pubsub/docs/publisher. [Accessed: 04-Dec-2022].
[16]	“Connect Google cloud pub/sub to Amazon SNS topics through cloud functions,” Google Cloud. [Online]. Available: https://cloud.google.com/community/tutorials/cloud-functions-sns-pubsub. [Accessed: 04-Dec-2022].

'''
