import React, { useState } from "react";
import Input from "./input";
import { validateInput, validateForm } from "./formValidationsNew";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
 
const Signup = ({ setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
 
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
 
  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
 
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormMessage({ type: "danger", text: "Please correct the errors before submitting." });
      return;
    }
 
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await axios.post("http://localhost:5001/api/signin", signupData);
      setFormMessage({ type: "success", text: response.data.message });
      setTimeout(() => setPage("login"), 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setFormMessage({ type: "danger", text: error.response.data.message });
      } else {
        setFormMessage({ type: "danger", text: "Signup failed. Please try again!" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      {formMessage.text && <div className={`alert alert-${formMessage.type}`} role="alert">{formMessage.text}</div>}
      <form onSubmit={handleSignup} className="p-3 border rounded shadow bg-white">
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-3 position-relative">
            <Input
              type={key.includes("password") ? "password" : "text"}
              name={key}
              value={formData[key]}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${touched[key] && errors[key] ? "is-invalid" : ""}`}
            />
            {touched[key] && errors[key] && <div className="tooltip-error">{errors[key]}</div>}
          </div>
        ))}
        <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>{isSubmitting ? "Signing Up..." : "Sign Up"}</button>
      </form>
      <p className="mt-3 text-center">
        Already have an account? <button className="btn btn-link p-0 align-baseline" onClick={() => setPage("login")}>
          Login
        </button>
      </p>
    </div>
  );
};
 
export default Signup;