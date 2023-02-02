import json

import os
from google.cloud import pubsub_v1
def hello_world(request):
    publisher = pubsub_v1.PublisherClient(
        publisher_options = pubsub_v1.types.PublisherOptions(
            enable_message_ordering=True,)
        )
    
    chatID = request.get_json().get('chatID')
    userEmail = request.get_json().get('userEmail')
    userName = request.get_json().get('userName')
    restaurantEmail = request.get_json().get('restaurantEmail')
    restaurantName = request.get_json().get('restaurantName')
    

    topic_name = 'projects/csci-5410-f2022/topics/customer_complaints'.format(
        project_id=os.getenv('csci-5410-f2022'),
        topic='customer_complaints',
    )
    chatroomDetails={}
    chatroomDetails['chatID']=chatID
    chatroomDetails['userEmail']=userEmail
    chatroomDetails['userName']=userName
    chatroomDetails['restaurantEmail']=restaurantEmail
    chatroomDetails['restaurantName']=restaurantName  
    chatJson = json.dumps(chatroomDetails)
    project_id= 'csci-5410-f2022'
    topic_id = 'customer_complaints'
    topic_path = publisher.topic_path(project_id,topic_id)  
    print(topic_path)    
    publisher.publish(topic_path,chatJson.encode("utf-8"))
    return f'Hello from Google Cloud'


