import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import SendMessage from "./SendMessage";

/** 
 * @author - Meet Master
 * Refereces -  https://www.geeksforgeeks.org/how-to-create-an-unique-id-in-reactjs/
 *              https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
 *              https://www.youtube.com/watch?v=gm-bggVJb5k
 *              https://stackoverflow.com/questions/67761397/how-to-clear-array-from-usestate
 *              https://www.freecodecamp.org/news/pass-data-between-components-in-react/#:~:text=First%2C%20you'll%20need%20to,one%20parent%20and%20one%20child.&text=Next%2C%20you'll%20import%20the,parent%20component%20and%20return%20it.&text=Then%20you'll%20create%20a,Hook%20to%20manage%20the%20data
 *              https://stackoverflow.com/questions/57139203/one-or-more-parameter-values-were-invalid-type-mismatch-for-key-xyz-expected-s
 *              https://stackoverflow.com/questions/44972594/inline-if-else-with-conditional-operator-not-working-react
 *              https://www.folkstalk.com/tech/float-right-in-react-js-with-code-examples/#:~:text=How%20do%20you%20float%20right%20in%20react%3F&text=Use%20textAlign%3A%20'right'%20on,%2Dend'%20on%20the%20View.
 */


function Chat() {
  const scroll = useRef();
  const [messages, setMessages] = useState([]);
  const params = useParams();

  useEffect(() => {
    // setMessages([]);
    fetchData();
  }, []);

  async function fetchData() {
    // setMessages([]);
    const q = query(
      collection(db, `ChatModule/${params.id}/Messages`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages([]);
      querySnapshot.forEach((doc) => {
        // cities.push(doc.data().name);
        console.log(doc.data());
        setMessages((messages) => [
          ...messages,
          {
            timestamp: doc.data().timestamp,
            text: doc.data().message,
            senderName: doc.data().sender,
            receiverName: doc.data().receiver,
          },
        ]);
      });
    });
  }

  return (
    <div>
      {messages?.reverse()?.map((data) => (
        <div key={data.timestamp}>
          {localStorage.getItem("userId") === data.senderName ? (
            <p style={{ textAlign: "right", paddingRight: "5rem" }}>
              {data.text}
            </p>
          ) : (
            <p style={{ textAlign: "left", paddingLeft: "5rem" }}>
              {data.text}
            </p>
          )}
        </div>
      ))}
      <SendMessage scroll={scroll} updateMsg={fetchData} />
      <div ref={scroll}></div>
      {/* <Button type="s"></> */}
    </div>
  );
}

export default Chat;
