import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const Dashboard = ({ setView }) => {
  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <Button variant="danger" onClick={() => setView("login")}>Logout</Button>
    </div>
  );
};

export default Dashboard;
