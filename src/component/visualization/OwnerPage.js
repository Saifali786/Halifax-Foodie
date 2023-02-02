
import {React, useState} from 'react';
export default function OwnerPage() {

  const [show, setShow] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [showPolarity, setShowPolarity] = useState(false);

  //visualize recipe
  const visualizeLogin = () => {
    setShow(true)
  }
  const back = () => {
    setShow(false)
    setShowRecipe(false)
    setShowPolarity(false)
  }
  //visualize recipe
  const visualizeRecipe = async() => {
    await fetch('https://3tpuatepjha6anhziq3jpgetkq0latrg.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      body:JSON.stringify( {
        email : localStorage.getItem('email')
      })
      
    })
    .then((response)=>  response.json().then( async (res)=> { 
      console.log(res)
      if(response.status === 200) {
        console.log(response)
        setShowRecipe(true)
      }
      else {
        alert("No recipes to show please upload a recipe");
      }
    }));
    
  }
  //visualize polarity
  const visualizePolarity = async() => {
    await fetch('https://c25an4dsqwsvv7ucvyhcwjtwau0asivf.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      body:JSON.stringify( {
        email : localStorage.getItem('email')
      })
      
    })
    .then((response)=>  response.json().then( async (res)=> { 
      if(response.status === 200) {
        console.log(res)
        setShowPolarity(true)
      }
      else {
        alert("No feedback for your restaurant yet");
      }
    }));
    
  }
  //Navigate to login 
  const Logout = () => {
    window.location.href = "/login"
  }
  return ( 
    <div style={{
      display: 'flex',
      marginTop: '10px',
      alignItems: 'center',
      justifyContent: 'center'
  }}> 
    
    <div >
      {show ? <div class = "visualize">
    <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/b5856820-4850-41c0-a12c-d324c5f5e780/page/tHG9C" allowfullscreen ></iframe>
    </div>:  <div/>
    }  
    </div>
    <div>
      {showRecipe ?  <div class = "visualizeRecipe">
      <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/1961aef3-2084-410e-8a8a-4fe6e1bc0bf5/page/3KX9C" allowfullscreen></iframe>  
    </div>: <div/>
    }  
    </div>
    <div>
      {showPolarity ?  <div class = "visualizePolarity">
      <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/f4cae5db-d518-4292-8266-2ac8432e178a/page/72W9C" allowfullscreen></iframe>
    </div>: <div/>
    }  
    </div>
    <button onClick={visualizeLogin}>
        Visualize Login Statistics
      </button>
    <button onClick={visualizeRecipe}>
        Visualize Recipe
      </button>
    <button onClick={visualizePolarity}>
        Visualize Polarity
      </button>

     <button onClick={back}>
      Back</button> 
     
      <button onClick={Logout}>
      Logout</button> 
    
    </div>

 
   );
      
}

