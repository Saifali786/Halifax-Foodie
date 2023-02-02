// Reference: https://git.cs.dal.ca/prasla/csci5410-f23-b00899528/-/tree/A2
import React, { useState, useEffect } from 'react';
import {Box, CardContent, Typography, Card} from '@mui/material';

export default function CustomerPage() {
  const [data, setData] = useState([]);

//Fetch all restaurant details on rendering
  useEffect( async () => { 
    console.log(localStorage.getItem("email"))
    await fetch('https://24fvpz5mw52eavbxarqzyy7i7y0hbiic.lambda-url.us-east-1.on.aws/',{
      method: 'POST',
    }).then(async (res) => {
        await res.json().then((response) => {
          console.log(response)
          setData(response)  
        })
    }).catch(function (error) {
        console.log(error);
        }
        )
      } , []
      );
 //Navigate to Login     
const Logout = () => {
    window.location.href = "/login"
  }

const feedbackform = (email, name) => {
    localStorage.setItem('restaurant_email', email)
    localStorage.setItem('restaurant_name', name);
    window.location.href = "/feedback"
  }

return (

  <div style={{
    display: 'flex',
    marginTop: '10px',
    alignItems: 'center',
    justifyContent: 'center'
}}> 
<div>
</div>
   <div >

      <button onClick={Logout}>
      Logout</button> 
              <h3>List of Restaurants</h3>  
    
              {data.length !== 0 ? data.map((d) => {
                  return (
                     // Reference : https://mui.com/material-ui/react-card/#OutlinedCard.js
                      <React.Fragment>
                          <Box sx={{ minWidth: 275 }}>
                              <Card variant="outlined">
                                  <CardContent>
                                      <Typography sx={{ fontSize: 14 }} color="text.secondary">
                                          Restaurant email: {d.restaurant_email_id}
                                      </Typography>
                                      <Typography sx={{ mb: 1.5, fontSize: 14 }}  color="text.secondary">
                                          Restaurant name: {d.name}
                                      </Typography>
                                      <Typography sx={{ fontSize: 14 }} color="text.secondary">
                                      <button onClick={() => {feedbackform(d.restaurant_email_id, d.name )}}>
                                      Feedback</button>
                                      </Typography>
                                  </CardContent>
                              </Card>
                          </Box>
                      </React.Fragment>
                      
                  );
              }) :
            <p>No records exists</p>}

          </div>
  </div>
    )
}