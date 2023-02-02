 //Reference: https://firebase.google.com/docs/admin/setup#node.js_1(firebase admin)
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore(); 

const collection = 'question-answer';  // collection name

exports.storeQA = async (req, res) => {  //setting headers for CORS
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
    const question = req.body.question;
    const answer = req.body.answer;
    const email = req.body.email;

    try {
      //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
      //Reference: https://firebase.google.com/docs/firestore/query-data/get-data

      await db.collection(collection).doc(email).set({  //adding question and answer to Firestore
        question,
        answer
      });
      return res.status(200).send('Security question and answer stored on the firestore');
    } 
    catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  }
  
};


