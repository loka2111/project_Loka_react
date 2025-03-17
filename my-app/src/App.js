import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./component/signin";    
import Login from "./component/login";      
import Dashboard from "./component/dashboard"; 
import style from "./component/styles.css";

const App = () => {
  const [view, setView] = useState("login"); // "login", "signup", "dashboard"

  return (
    <div>
      {view === "login" && <Login setView={setView} />}
      {view === "signup" && <Signup setView={setView} />}
      {view === "dashboard" && <Dashboard setView={setView} />}
    </div>
  );
};


export default App;
