import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./component/signin";    
import Login from "./component/login";      
import Dashboard from "./component/dashboard"; 


const App = () => {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  return (
    <div>
      {page === "login" && <Login setPage={setPage}setUser={setUser} />}
      {page === "signin" && <Signup setPage={setPage} />}
      {page === "dashboard" && <Dashboard user={user}setPage={setPage} />}
    </div>
  );
};


export default App;
