// Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import { FormHelperText } from "@mui/material";
import React, {useState} from "react";
import {Card, Form , Button} from 'react-bootstrap'
import Axios from "axios";

export default function CipherRegistration() {
  const [key, setKey] = useState("");
  const[plainText,setPlainText] = useState("");
  const[loading,setLoading] = useState("");
  const[cipher, setCipher] = useState("");
  const [error, setError] = useState({});
  const cipherValidation = async (event) => {
    event.preventDefault();
    setLoading(true);
    //Key Validation
    if (key === undefined || key === null || key.length !== 4) {
      console.log(key.length)
      error.key = 'Key should be of length 4';  
    }
    //Plain Text validation
    else if (plainText === undefined || plainText === null || plainText === 0) {
      error.plainText = 'Please enter plain text';
      setError(error.plainText)
       
    }
    else { 
    console.log(localStorage.getItem('email'))
    Axios.defaults.headers.post['Content-Type'] = 'application/json';

    //Triggering Lambda to generate Cipher Text based on key and plain text provided
    await fetch('https://dauhnbva2bjlx6clyb6q22aha40bhyim.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      body:JSON.stringify( {
        email :localStorage.getItem('email'),
        key : key,
        text: plainText,
      })
      
    }).then((response)=> response.json().then( async (res)=>{
      setCipher(res.cipher)
      console.log(res.cipher)
      alert("Your cipher is  " + res.cipher)
      window.location.href = "/login"
      }))
    }
  };

  return (
    // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
    <>
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>Cipher</h2>
       
        <Form onSubmit={cipherValidation}>
        <Form.Group id = "key">
            <Form.Label>Key</Form.Label>
            <Form.Control name = 'key' type = "text" value = {key} onChange = {(event) => setKey(event.target.value)} error = {error.key} required />
            <FormHelperText>{error.key}</FormHelperText>
          </Form.Group>
          <Form.Group id = "plainText">
            <Form.Label>Plain Text</Form.Label>
            <Form.Control name = 'plainText' type = "text" value = {plainText} onChange = {(event) => setPlainText(event.target.value)} error = {error.plainText} required />
            <FormHelperText>{error.plainText}</FormHelperText>
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