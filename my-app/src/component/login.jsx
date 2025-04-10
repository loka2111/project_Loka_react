import React, { useState } from "react";
import Input from "./input";
import { validateInput, validateForm } from "./formValidationsNew";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import hospitalImage from"../image/login.jpg";

const divStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${hospitalImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};
const Login = ({ setPage }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };
 
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: "", text: "" });
   
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFormMessage({ type: "danger", text: "Please fix errors before submitting." });
      setIsSubmitting(false);
      return;
    }
 
    try {
      const response = await axios.post("http://localhost:5001/api/login", formData);
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userDetails", JSON.stringify(user));
        setFormMessage({ type: "success"});
        setTimeout(() => setPage("dashboard"),500);
      }
    } catch (error) {
      setFormMessage({ type: "danger", text: "Invalid credentials. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div style={divStyle}>
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      {formMessage.text && <div className={`alert alert-${formMessage.type}`} role="alert">{formMessage.text}</div>}
      <form onSubmit={handleLogin} className="p-3 border rounded shadow bg-white">
        <div className="mb-3 position-relative">
          <Input
            type="text"
            name="identifier"
            value={formData.identifier}
            placeholder="Username or Email"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${touched.identifier && errors.identifier ? "is-invalid" : ""}`}
          />
          {touched.identifier && errors.identifier && <div className="tooltip-error">{errors.identifier}</div>}
        </div>
 
        <div className="mb-3 position-relative">
          <Input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
          />
          {touched.password && errors.password && <div className="tooltip-error">{errors.password}</div>}
        </div>
 
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>{isSubmitting ? "Logging In..." : "Login"}</button>
        <p className="mt-3 text-center">
        Don’t have an account? <button className="btn btn-link p-0 align-baseline" onClick={() => setPage("signin")}>Sign Up</button>
      </p>
      </form>
      
    </div>
    </div>
  );
};
 
export default Login;