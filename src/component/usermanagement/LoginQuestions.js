// Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import { FormHelperText } from "@mui/material";
import React, {useState} from "react";
import {Card, Form , Button} from 'react-bootstrap'
import Axios from "axios";

export default function LoginQuestions() {
  const [answer, setAnswer] = useState("");
  const[loading,setLoading] = useState("");
  const [error, setError] = useState({});
  const question =  "In which city were you born?";
  const questionAnswerForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    //Anwer validation
    if (answer === null || answer.length === 0 || answer === undefined ) {
      error.answer = 'Answer is required';
      setError(error.answer)
      
    }
    console.log(question)
    console.log(answer)
    console.log(localStorage.getItem('email'))

    //Sending both question and answer to cloud function which will validate the anwer provided by the user
    Axios.post('https://us-central1-a2serverless-c5e21.cloudfunctions.net/validateQA', {
        email :localStorage.getItem('email'),
        question : question,
        answer: answer,
      })
      .then(response => {
        if(response.status === 200) {
          console.log(response.data)
          window.location.href = "/login/cipher"
        }
        if(response.status === 201) {
          console.log(response.data)
          alert(response.data)
          
        }
        if(response.status === 202) {
          console.log(response.data)
          alert(response.data)
         }
        console.log(response);
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

