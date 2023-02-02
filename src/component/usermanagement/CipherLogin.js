// Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import { FormHelperText } from "@mui/material";
import React, {useState} from "react";
import {Card, Form , Button} from 'react-bootstrap'
import Axios from "axios";

export default function CipherLogin() {

  const[loading,setLoading] = useState("");
  const[cipher, setCipher] = useState("");
  const [error, setError] = useState({});
  const email = localStorage.getItem('email')
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const cipherValidation = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    //cipher validation
    if (cipher === undefined || cipher === null) {
      error.cipher = 'Please enter cipher text provided during sign up';
      setError(error.plainText)
       
    }
    console.log(localStorage.getItem('email'))
    console.log(localStorage.getItem('role'))
    Axios.defaults.headers.post['Content-Type'] = 'application/json';
    //Sending Cipher to the Lambda function which will fetch the user's key and plain text and verify the cipher 
    await fetch('https://m5cndnzaktmmg6n7eacdrob4e40qolck.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      body:JSON.stringify( {
        email : email,
        cipher : cipher,
      })
      
    }).then((response)=>  response.json().then( async (res)=> { 
      console.log(res)
      if(res === "No record exist in the database")
      alert(res+ "\nPlease Register ");
      
      else if(res.body === "Incorrect cipher text")
      alert(res.body)
      else { 
      localStorage.setItem('email',  email)  
      localStorage.setItem('navKey', true);
      const role = localStorage.getItem('role')
      if(role === "Owner") {  //Navigate to owner page  
     
      window.location.href = "/owner"
      }
      if(role === "Customer") {  //Navigate to customer page
        loginStatistics() //Store customer's login date, time, month, year
        setTimeout(12000);
        window.location.href = "/customer"
      }
    }
      }))
  };

  const loginStatistics = async () => {

    await fetch('https://mglc2v7kuqv7lvf3fd6qdh7q4e0gcbxh.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      body:JSON.stringify( {
        email : email,
        year : year,
        month : month,
        day : day
      })
      
    }).then((response)=> response.json().then( async (res)=> { 
      console.log(res)
      return
      
  })).catch(console.log(error));
}

  return (
    // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
    <>
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>Cipher</h2>
       
        <Form onSubmit={cipherValidation}>
        <Form.Group id = "key">
            <Form.Label>Cipher provided during registration</Form.Label>
            <Form.Control name = 'cipher' type = "text" value = {cipher} onChange = {(event) => setCipher(event.target.value)} error = {error.cipher} required />
            <FormHelperText>{error.cipher}</FormHelperText>
          </Form.Group>
          <div>
          <Button disable = {loading} type = "submit">Submit</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>

    </>
  )
  }