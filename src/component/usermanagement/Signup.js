// Reference: // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import React, {useState} from "react";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import FormHelperText from '@mui/material/FormHelperText'
import UserPool from "./UserPool";
import {Card, Form , Button} from 'react-bootstrap'
import { Link } from "react-router-dom";


export default function Signup (){
  const errorMessage = {};
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password,setPassword] = useState("");
  const [role, setRole] = useState("")
  const[loading,setLoading] = useState("");
  const [error, setError] = useState({});
  let errorFlag = 0;


  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    console.log(email)
    console.log(role)
    const formData = {
      name, 
      email,
      password,
      role
    }
    setError(validateForm(formData))
    if(errorFlag === 0) { //proceed only if there are no errors
      try {
        const registerResponse = await registerUser(
          email,
          password,
          name,
          role
        );
        console.log(registerResponse);
        console.log(role)
        console.log(name) 
        localStorage.setItem('email',  email)
        localStorage.setItem('role',  role)
        window.location.href = "/registration/questions";
      }
      catch (error) {
        //Email id already exists validation
        if (error.name === 'UsernameExistsException') {
          alert("Email id already exists")
         
        }
        //Invalid password validation(Used Cogntio's in built password validation)
        if(error.name === 'InvalidPasswordException') {
          alert("Password must be 8 characters long and must contain uppercase, lowercase, numbers, and special characters")
        }  
        console.log(error);
      }
      setLoading(false)
    }
  };

  //email validation
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

const registerUser = (email, password, name, role ) => {
  return new Promise((resolve, reject) => {

    //Creating a attribute list
    var attributeList = [];

    //Pushing all the user attributes to the Attribute list
    attributeList.push(new CognitoUserAttribute({
      Name : "email",
      Value: email
    }));

    attributeList.push(new CognitoUserAttribute({
      Name : "custom:password",
      Value: password
    }));

    attributeList.push(new CognitoUserAttribute({
      Name: "name",
      Value : name
    }));

    attributeList.push(new CognitoUserAttribute({
      Name: "custom:role",
      Value : role
    }));

    // Reference: https://www.youtube.com/watch?v=8WZmIdXZe3Q
    UserPool.signUp(email, password, attributeList, null, (err,data) => {
      if(err) {
        reject(err)
      }
     resolve(data)
    
  });
})
};
return (
  // Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
  <>
  <Card>
    <Card.Body>
      <h2 className='text-center mb-4'>Sign Up</h2>
      <Form onSubmit={onSubmit}>
        
        <Form.Group id = "name">
          <Form.Label>Name</Form.Label>
          <Form.Control name = 'name' type = "text" value = {name}  onChange = {(event) => setName(event.target.value)}required />
        </Form.Group>
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
      <label htmlFor = "role">Role &nbsp;</label>

         <input type="radio" name = "role" value= "Owner"  checked={role === 'Owner'}  onChange = {(event) => setRole(event.target.value)}  required/> Owner &nbsp;

         <input type="radio" name = "role" value= "Customer" checked={role === 'Customer'} onChange = {(event) => setRole(event.target.value)} required/> Customer
         </div>

         <div>
        <Button disable = {loading} type = "submit">Sign up</Button>
        </div>
      </Form>
    </Card.Body>
  </Card>
  <div className='w-100 text-center mt -2'> Already a user? <Link to = "/login">Log In</Link></div>
  </>
)
}

