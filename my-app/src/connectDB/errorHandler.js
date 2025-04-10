const ERROR_CODES = {
    BAD_REQUEST: { code: 400, message: "Bad Request. Please check your input." },
    UNAUTHORIZED: { code: 401, message: "Unauthorized. Invalid credentials." },
    FORBIDDEN: { code: 403, message: "Forbidden. No token provided." },
    NOT_FOUND: { code: 404, message: "API endpoint not found." },
    CONFLICT: { code: 409, message: "User already exists with this email or phone number." },
    SERVER_ERROR: { code: 500, message: "Internal server error. Please try again later." },
    SUCCESS: { code: 200, message: "Success." },
    CREATED: { code: 201, message: "Resource created successfully." }
  };
 
  module.exports = ERROR_CODES;