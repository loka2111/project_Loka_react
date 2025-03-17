const userNameValidation = (value) => {
    
    const pattern = /^[a-zA-Z0-9_]{3,16}$/;

    if (pattern.test(value)) {
        return { isValid: true, message: "" };
    } else {
        return { isValid: false, message: "Invalid username: Must be 3-16 characters long and contain only letters, numbers, or underscores." };
    }
};

const emailValidation = (value) => {
   
    const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (pattern.test(value)) {
        return { isValid: true, message: "" };
    } else {
        return { isValid: false, message: "Invalid Email: Please enter a valid email address." };
    }
};

const passwordValidation = (value) => {
    if (value.length < 8 || value.length > 16) {
        return { isValid: false, message: "Password must be 8-16 characters long." };
    }
    if (!/[A-Z]/.test(value)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!/\d/.test(value)) {
        return { isValid: false, message: "Password must contain at least one number." };
    }
    if (!/[@$!%*?&]/.test(value)) {
        return { isValid: false, message: "Password must contain at least one special character (@$!%*?&)." };
    }
    return { isValid: true, message: "" };
};



export { userNameValidation, emailValidation, passwordValidation };
