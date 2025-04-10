const validateInput = (name, value) => {
  const patterns = {
    identifier: /^(?![-_])[a-zA-Z0-9-_]{8,16}(?<![-_])$|^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // Updated for strict username/email check
    password: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,16}$/, // Ensuring at least one uppercase, number, and special char
    name: /^[A-Za-z\s]+$/, // Only alphabets and spaces allowed
    phone: /^\d{10}$/, // Exactly 10 digits
  };
 
  if (!value.trim()) {
    return "This field is required";
  }
 
  if (patterns[name] && !patterns[name].test(value)) {
    switch (name) {
      case "identifier":
        return "Invalid identifier. It should be a valid email or username (8-16 characters, no special chars at the start or end).";
      case "password":
        return "Invalid password. It must be 8-16 characters, including an uppercase letter, a number, and a special character.";
      case "name":
        return "Invalid name. Only alphabets and spaces are allowed.";
      case "phone":
        return "Invalid phone number. It must contain exactly 10 digits.";
      default:
        return `Invalid ${name}`;
    }
  }
 
  return "";
};
 
const validateForm = (formData) => {
  const errors = {};
  for (const [key, value] of Object.entries(formData)) {
    const error = validateInput(key, value);
    if (error) errors[key] = error;
  }
  return errors;
};
export { validateInput, validateForm };
 