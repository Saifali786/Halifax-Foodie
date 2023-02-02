import React, {useState} from "react";
import { CognitoUserAttribute,AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import FormHelperText from '@mui/material/FormHelperText'
import UserPool from "./UserPool";
import {Card, Form , Button} from 'react-bootstrap'

export default function Feedback (){
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [feedback,setfeedback] = useState("");
  const[loading,setLoading] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    await fetch('https://bpdbogjb7k4qoipjjyiftrteca0faokd.lambda-url.us-east-1.on.aws/', {
    method: 'POST',
    body: JSON.stringify( {
    id: Date.now().toString(),  
    email : localStorage.getItem('restaurant_email'),
    name: localStorage.getItem('restaurant_name'),
    feedback : feedback
  })     
    }).then((response)=> response.json().then( async (res)=>{
      console.log(res)
      alert("Successfully inserted")
          }))   
      setLoading(false)
  };

  const back = () => {
    window.location.href = "/customer"
  }

return (
  // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
  <>
  <Card>
    <Card.Body>
      <h2 className='text-center mb-4'>Feedback Form</h2>
      <Form onSubmit={onSubmit}>
      <Form.Group id = "feedback">
          <Form.Label>Feedback</Form.Label>
          <Form.Control name = 'feedback' type = "text" value = {feedback} onChange = {(event) => setfeedback(event.target.value)}required />
        </Form.Group>
         <div>
        <Button disable = {loading} type = "submit">Submit</Button>
        <Button style = {{marginLeft: 10}} onClick= {back} >Home</Button>
        </div>
        <br/>
        
      </Form>
    </Card.Body>
  </Card>

  </>
)
}

