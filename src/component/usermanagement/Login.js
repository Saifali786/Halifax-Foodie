// Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import React, {useState} from "react";
import { CognitoUserAttribute,AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import FormHelperText from '@mui/material/FormHelperText'
import UserPool from "./UserPool";
import {Card, Form , Button} from 'react-bootstrap'
import { Link } from "react-router-dom";


export default function Login (){
  const errorMessage = {};
  const [email, setEmail] = useState("")
  const [password,setPassword] = useState("");
  const[loading,setLoading] = useState("");
  const [error, setError] = useState({});
  var role = {}
  let errorFlag = 0;

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = {
      email,
      password
    }
    setError(validateForm(formData))
    if(errorFlag === 0) { //proceed only if there are no errors
      try {
        const loginResponse = await Login(
          email,
          password,
        );
        console.log(loginResponse);

        // Triggering Lambda to get user details from Dynamo Db
        await fetch('https://3m2b2r6xjnqdzm52rltyagmnki0qgmxp.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        body: JSON.stringify( {
        email :email
      })
      
    }).then((response)=> response.json().then( async (res)=>{
      console.log(res)
      //Email already exists validation
      if(res.body === "Email does not exist" ) {
      alert("Email does not exist")
      }
      else {
      localStorage.setItem('email',  email)
      localStorage.setItem('role',  res)
      window.location.href = "/login/questions"
      }
      
      }))   
      }
      catch (error) {
        //Password and email validation
        if(error.name === 'NotAuthorizedException') {
          alert("Incorrect email or password")
        }
        //Not confirmed validation
        if(error.name === 'UserNotConfirmedException') {
          alert("Your email has not been confirmed, verify email")
        }
        console.log(error);
      }
      setLoading(false)
    }
  };
  //Email validation
  const validateForm = (props) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;  //Reference : https://regexr.com/3e48o
    if(emailRegex.test(props.email) === false){
      errorFlag = 1;
      errorMessage.email = "Email is not valid"
      }
    else {
        errorFlag = 0;
    }
    return errorMessage;

}
const Login = (email, password) => {
  return new Promise((resolve, reject) => {

    const user = new CognitoUser({
      Username: email,
      Pool : UserPool
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    // Reference: https://www.youtube.com/watch?v=8WZmIdXZe3Q
    //Calling authenticateUser method to authenticate user
    user.authenticateUser(authenticationDetails, {
      onFailure: (error) => {
        console.log("onFailure: ", error)
        reject(error);}
      ,
      onSuccess: (data) => {
        console.log("onFailure");
        console.log(data)
        resolve(data);
      },
     });
  });
}


return (
  // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
  <>
  <Card>
    <Card.Body>
      <h2 className='text-center mb-4'>Log In</h2>
      <Form onSubmit={onSubmit}>

        <Form.Group id = "email">
          <Form.Label>Email</Form.Label>
          <Form.Control name = 'email' type = "email" value = {email}  onChange = {(event) => setEmail(event.target.value)} error={error.email} required />
          <FormHelperText>{error.email}</FormHelperText>
        </Form.Group>
        <Form.Group id = "password">
          <Form.Label>Password</Form.Label>
          <Form.Control name = 'password' type = "password" value = {password} onChange = {(event) => setPassword(event.target.value)} error={error.password} required />
          <FormHelperText>{error.password}</FormHelperText>
        </Form.Group>
         <div>
        <Button disable = {loading} type = "submit">Log In</Button>
        </div>
      </Form>
    </Card.Body>
  </Card>
  <div className='w-100 text-center mt -2'> Not registered? <Link to = "/">Sign Up</Link></div>
  </>
)
}

