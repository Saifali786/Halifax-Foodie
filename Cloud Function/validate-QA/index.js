//Reference: https://firebase.google.com/docs/admin/setup#node.js_1(firebase admin)
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

const collection = 'question-answer'; //collection-name

exports.validateQA = async (req, res) => { //setting headers for CORS
  // Reference : https://gist.github.com/nilcolor/816580 
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
      var headers = {};
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = false;
      headers["Access-Control-Max-Age"] = '86400';
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
      res.writeHead(200, headers);
      res.end();
} else {
    const email = req.body.email;
    const answer = req.body.answer;
  
    try {
      //Reference : https://stackoverflow.com/questions/47308159/whats-the-best-way-to-check-if-a-firestore-record-exists-if-its-path-is-known

      const docRef = await db.collection(collection).doc(email).get();
      if (docRef.exists) { // if document exists proceed
        const doc = await docRef.data();
        const correctAnswer = doc.answer; //match the answer
    
        if (answer === correctAnswer) {
          return res.status(200).send('Answer is correct');
        } else {
           return res.status(201).send('Answer is not correct')
        }
      } 
      else {
        return res.status(202).send('User record does not exist')
      }
    } 
    catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
};