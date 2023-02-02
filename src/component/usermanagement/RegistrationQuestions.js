// Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import { FormHelperText } from "@mui/material";
import React, {useState} from "react";
import {Card, Form , Button} from 'react-bootstrap'
import Axios from "axios";

export default function RegistrationQuestions() {
  const [answer, setAnswer] = useState("");
  const[loading,setLoading] = useState("");
  const [error, setError] = useState({});
  const question =  "In which city were you born?"; 
  const questionAnswerForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    //Answer validation
    if (answer === null || answer.length === 0 || answer === undefined ) {
      error.answer = 'Answer is required';
      setError(error.answer)
      
    }
    console.log(question)
    console.log(answer)
    console.log(localStorage.getItem('email'))
    console.log(localStorage.getItem('email'))

    //Trigger cloud function to store question and answer
    Axios.post('https://us-central1-a2serverless-c5e21.cloudfunctions.net/storeQA', {
        email :localStorage.getItem('email'),
        question : question,
        answer: answer,
      })
      .then(response => {
        console.log(response);
        window.location.href = "/registration/cipher"
    }).catch(function (error) {
      console.log("error");
});

  };

  return (
     // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
    <>
    <Card>
      <Card.Body>
        <h2 className='text-center mb-4'>Security Question</h2>
        <Form onSubmit={questionAnswerForm}>
        <Form.Group id = "question">
            <Form.Label>Question</Form.Label>
            <Form.Control name = 'question' type = "text" value = {question} />
          </Form.Group>

          
          <Form.Group id = "answer">
            <Form.Label>Answer</Form.Label>
            <Form.Control name = 'answer' type = "text" value = {answer} onChange = {(event) => setAnswer(event.target.value)} error = {error.answer} required />
            <FormHelperText>{error.answer}</FormHelperText>
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

