import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
 
const Input = ({ type, name, value, placeholder, onChange, onBlur, error }) => {
  return (
    <div className="mb-3">
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
export default Input;