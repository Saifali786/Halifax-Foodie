import React from 'react';
import "./App.css";
import { AppRoutes } from "./AppRoutes";
import ApplicationNavbar from "./component/Navbar";


function App() {
  
  return (
    <div >
      {console.log(localStorage.getItem('navKey'))}
      <div>
        { 
          localStorage.getItem('navKey') !== null ? ( 
            <div style  = {{ visibility: "visible" }}>
              <ApplicationNavbar />
            </div>
     
           
          ) : (
            <div  style  = {{ visibility:"hidden" }}>
            <ApplicationNavbar/>
            </div>
          )
        }
        <AppRoutes />
        {/* <AwsConfig/> */}
      </div>
      <div><kommunicateChat/></div>
      </div>
    
   
   

  );
}

export default App;
