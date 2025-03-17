import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { userNameValidation, emailValidation, passwordValidation } from "./formValidation";

const Signup = ({ setView }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userNameTitle, setUserNameTitle] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let errs = {};
    const usernameRegex = /^[a-zA-Z0-9-_]{8,16}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    errs.username = !formData.username.match(usernameRegex) ? "Invalid username" : "";
    errs.email = !formData.email.match(emailRegex) ? "Invalid email" : "";
    errs.phone = !formData.phone.match(phoneRegex) ? "Invalid phone number" : "";
    errs.password = !formData.password.match(passwordRegex) ? "Weak password" : "";
    errs.confirmPassword = formData.password !== formData.confirmPassword ? "Passwords do not match" : "";

    setErrors(errs);
    return Object.values(errs).every((err) => err === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("user", JSON.stringify(formData));
      setShowModal(true);
    }
  };

  const onChangeValues = (event) => {
    const validValue = userNameValidation(event.target.value);
    if (!validValue.isValid) {
      setUserNameTitle(validValue.message);
    } else {
      setUserNameTitle("");
      setFormData({ ...formData, name: event.target.value });
    }
  };

  const onChangeEmail = (event) => {
    const validEmail = emailValidation(event.target.value);
    if (!validEmail.isValid) {
      setEmailError(validEmail.message);
    } else {
      setEmailError("");
      setFormData({ ...formData, email: event.target.value });
    }
  };

  const onChangePassword = (event) => {
    const validPassword = passwordValidation(event.target.value);
    if (!validPassword.isValid) {
      setPasswordError(validPassword.message);
    } else {
      setPasswordError("");
      setFormData({ ...formData, password: event.target.value });
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control" placeholder="Name" onChange={onChangeValues} required title={userNameTitle} />
        <p className="text-danger">{errors.username}</p>

        <input type="text" className="form-control" placeholder="Email" onChange={onChangeEmail} required title={emailError} />
        <p className="text-danger">{errors.email}</p>

        <input type="password" className="form-control" placeholder="Password" onChange={onChangePassword} required title={passwordError} />
        <p className="text-danger">{errors.password}</p>

        <input type="password" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} placeholder="Confirm Password" onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
        <p className="text-danger">{errors.confirmPassword}</p>

        <input type="text" className={`form-control ${errors.phone ? "is-invalid" : ""}`} placeholder="Phone" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        <p className="text-danger">{errors.phone}</p>

        <Button type="submit" variant="primary">Signup</Button>
        <Button variant="link" onClick={() => setView("login")}>Already have an account? Login</Button>
      </form>

      <Modal show={showModal} onHide={() => setView("login")}>
        <Modal.Header closeButton>
          <Modal.Title>Signup Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have successfully signed up!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setView("login")}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Signup;
