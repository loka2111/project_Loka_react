import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const Login = ({ setView }) => {
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      (storedUser.username === formData.usernameOrEmail || storedUser.email === formData.usernameOrEmail) &&
      storedUser.password === formData.password
    ) {
      setView("dashboard");
    } else {
      setErrors({ usernameOrEmail: true, password: true });
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`form-control ${errors.usernameOrEmail ? "is-invalid" : ""}`}
          placeholder="Username or Email"
          onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
          required
        />
        <br />
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <br />
        <Button type="submit" variant="success">Login</Button>
        <Button variant="link" onClick={() => setView("signup")}>Signup</Button>
      </form>
    </div>
  );
};

export default Login;
