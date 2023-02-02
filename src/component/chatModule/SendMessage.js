import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";

/**
 * @author - Meet Master
 * References - https://reactjs.org/docs/hooks-effect.html
 *              https://www.npmjs.com/package/uuid
 *              https://bobbyhadz.com/blog/react-merge-inline-styles#:~:text=Use%20the%20spread%20syntax%20to,get%20applied%20to%20the%20element.
 *              https://www.freecodecamp.org/news/pass-data-between-components-in-react/#:~:text=First%2C%20you'll%20need%20to,one%20parent%20and%20one%20child.&text=Next%2C%20you'll%20import%20the,parent%20component%20and%20return%20it.&text=Then%20you'll%20create%20a,Hook%20to%20manage%20the%20data
 *              https://bobbyhadz.com/blog/react-map-is-not-a-function
 *              https://stackoverflow.com/questions/47616355/foreach-in-react-jsx-does-not-output-any-html
 *              https://stackoverflow.com/questions/46000360/use-of-then-in-reactjs
 */

function SendMessage(props) {
  const [msg, setMsg] = useState("");
  const params = useParams();
  const collectionRef = collection(db, `ChatModule/${params.id}/Messages`);

  async function sendMessage(e) {
    e.preventDefault();

    const docRef = doc(db, "ChatModule", `${params.id}`);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    console.log(docSnap.exists());

    if (docSnap.exists()) {
      addDoc(collectionRef, {
        message: msg,
        sender: localStorage.getItem("userId"),
        // receiver: "receiverName",
        timestamp: Timestamp.now(),
      });
    } else {
      setDoc(docRef, {
        customerName: "customerName",
        customerEmail: "customerEmail",
        resturentName: "resturentName",
        resturentEmail: "resturentEmail",
        customerComplaint: "customerComplaint",
        compalintStatus: true,
        chatRoomCreatedAt: Timestamp.now(),
      }).then(
        addDoc(collectionRef, {
          message: msg,
          sender: localStorage.getItem("userId"),
          // receiver: "receiverName",
          timestamp: Timestamp.now(),
        })
      );
    }

    setMsg("");
    props.updateMsg();
    props.scroll.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <form onSubmit={sendMessage}>
        <FloatingLabel controlId="floatingTextarea2" label="">
          <Form.Control
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            as="textarea"
            placeholder="Enter your message here..."
            style={{ height: "100px" }}
          />
        </FloatingLabel>
        <Button type="submit" variant="dark">
          Send Message
        </Button>
      </form>
    </div>
  );
}

export default SendMessage;
