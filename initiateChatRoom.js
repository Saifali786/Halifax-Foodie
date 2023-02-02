const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = async(event, context) => {
  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'Hello, World';
  console.log(message);
  const complaint = JSON.parse(message) 

  const chatID=complaint.chatID
  console.log(chatID);
  const userEmail=complaint.userEmail
  console.log(userEmail);
  const userName=complaint.userName
  console.log(userName);
  const restaurantEmail=complaint.restaurantEmail
  console.log(restaurantEmail);
  const restaurantName=complaint.restaurantName
  console.log(restaurantName);

  const data = {
  chatID ,
  userEmail,
  userName,
  restaurantEmail,
  restaurantName
};

    try {
      await db.collection('ChatModule').doc(chatID).set(data);
      return ;
    } 
    catch (error) {
      console.log(error);
      return;
    }

};
  




