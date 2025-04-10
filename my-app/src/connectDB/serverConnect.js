const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ERROR_CODES = require("./errorHandler");

const app = express();
const PORT = 5001;
const SECRET_KEY = "your_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Blndatta@2111",
  database: "hospital",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// 📝 Signup Endpoint
app.post("/api/signin", async (req, res) => {
  const { name, username, email, password, phone } = req.body;
  if (!name || !username || !email || !password || !phone) {
    return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: ERROR_CODES.BAD_REQUEST.message });
  }

  try {
    const checkSql = "SELECT id FROM UserDetails WHERE email = ? OR username = ?";
    db.query(checkSql, [email, username], async (err, results) => {
      if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: ERROR_CODES.SERVER_ERROR.message });
      if (results.length > 0) return res.status(ERROR_CODES.CONFLICT.code).json({ message: ERROR_CODES.CONFLICT.message });

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql = "INSERT INTO UserDetails (name, username, email, password, phone) VALUES (?, ?, ?, ?, ?)";
      db.query(insertSql, [name, username, email, hashedPassword, phone], (err) => {
        if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: ERROR_CODES.SERVER_ERROR.message });
        res.status(ERROR_CODES.CREATED.code).json({ message: "Signup successful!" });
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: ERROR_CODES.SERVER_ERROR.message });
  }
});

// 📝 Login Endpoint
app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: ERROR_CODES.BAD_REQUEST.message });
  }

  const sql = "SELECT * FROM UserDetails WHERE username = ? OR email = ?";
  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: ERROR_CODES.SERVER_ERROR.message });
    if (results.length === 0) return res.status(ERROR_CODES.UNAUTHORIZED.code).json({ message: ERROR_CODES.UNAUTHORIZED.message });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(ERROR_CODES.UNAUTHORIZED.code).json({ message: ERROR_CODES.UNAUTHORIZED.message });

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.status(ERROR_CODES.SUCCESS.code).json({ message: "Login successful!", token, user });
  });
});

// 🛡️ Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(ERROR_CODES.FORBIDDEN.code).json({ message: ERROR_CODES.FORBIDDEN.message });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(ERROR_CODES.UNAUTHORIZED.code).json({ message: ERROR_CODES.UNAUTHORIZED.message });
    req.user = decoded;
    next();
  });
};

// 📋 Get User Details
app.get("/api/userdetails/:id", verifyToken, (req, res) => {
  db.query("SELECT id, name, username, email, phone FROM UserDetails WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: ERROR_CODES.SERVER_ERROR.message });
    if (results.length === 0) return res.status(ERROR_CODES.NOT_FOUND.code).json({ message: ERROR_CODES.NOT_FOUND.message });
    res.status(ERROR_CODES.SUCCESS.code).json({ data: results[0] });
  });
});

// 📌 Fetch All Roles
app.get("/api/roles", (req, res) => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error fetching roles" });
    res.status(ERROR_CODES.SUCCESS.code).json({ data: results });
  });
});

// ➕ Add Role
app.post("/api/roles", (req, res) => {
  const { roleName } = req.body;
  if (!roleName) return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: "Role name is required" });

  db.query("INSERT INTO roles (roleName) VALUES (?)", [roleName], (err, result) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error adding role" });
    res.status(ERROR_CODES.CREATED.code).json({ message: "Role added", roleID: result.insertId });
  });
});

// 🗑️ Delete Role
app.delete("/api/roles/:id", (req, res) => {
  db.query("DELETE FROM roles WHERE roleID = ?", [req.params.id], (err) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error deleting role" });
    res.status(ERROR_CODES.SUCCESS.code).json({ message: "Role deleted" });
  });
});

// 🗑️ Bulk Delete Roles
app.post("/api/roles/bulk-delete", (req, res) => {
  const { roleIDs } = req.body;
  if (!Array.isArray(roleIDs) || roleIDs.length === 0) {
    return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: "No roles selected" });
  }

  const placeholders = roleIDs.map(() => "?").join(",");
  db.query(`DELETE FROM roles WHERE roleID IN (${placeholders})`, roleIDs, (err) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error deleting roles" });
    res.status(ERROR_CODES.SUCCESS.code).json({ message: "Roles deleted" });
  });
});

// 📌 Fetch All Departments
app.get("/api/departments", (req, res) => {
  db.query("SELECT departmentID, departmentName FROM departments", (err, results) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error fetching departments" });
    res.status(ERROR_CODES.SUCCESS.code).json({ data: results });
  });
});

// ➕ Add Department
app.post("/api/departments", (req, res) => {
  const { departmentName } = req.body;
  if (!departmentName) return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: "Department name is required" });

  db.query("INSERT INTO departments (departmentName) VALUES (?)", [departmentName], (err, result) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error adding department" });
    res.status(ERROR_CODES.CREATED.code).json({ departmentID: result.insertId });
  });
});

// 🗑️ Delete Department
app.delete("/api/departments/:id", (req, res) => {
  db.query("DELETE FROM departments WHERE departmentID = ?", [req.params.id], (err) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error deleting department" });
    res.status(ERROR_CODES.SUCCESS.code).json({ message: "Department deleted" });
  });
});

// 🗑️ Bulk Delete Departments
app.post("/api/departments/bulk-delete", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: "No departments selected" });
  }

  const placeholders = ids.map(() => "?").join(",");
  db.query(`DELETE FROM departments WHERE departmentID IN (${placeholders})`, ids, (err) => {
    if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error deleting departments" });
    res.status(ERROR_CODES.SUCCESS.code).json({ message: "Departments deleted" });
  });
});

// 👤 Get Current User
app.get("/api/user/me", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, username, email, phone, roleName, department FROM userdetails WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Database error" });
      if (results.length === 0) return res.status(ERROR_CODES.NOT_FOUND.code).json({ message: "User not found" });
      return res.status(ERROR_CODES.SUCCESS.code).json({ message: "User details retrieved successfully", data: results[0] });
    }
  );
});

// 📋 Get All Users (Admin)
app.get("/api/userdetails", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, username, email, phone, roleName, department FROM userdetails",
    (err, results) => {
      if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Database error" });
      return res.status(ERROR_CODES.SUCCESS.code).json({ message: "User list retrieved successfully", data: results });
    }
  );
});

// 🧑‍💼 Get Assigned Users Only
app.get("/api/userdetails/assigned", (req, res) => {
  db.query(
    "SELECT id, name, email, roleName, department FROM userdetails WHERE roleName IS NOT NULL AND department IS NOT NULL",
    (err, results) => {
      if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error fetching employees" });
      return res.status(ERROR_CODES.SUCCESS.code).json({ message: "Assigned employees fetched", data: results });
    }
  );
});

// 📝 Assign Role & Department to User
app.put("/api/userdetails/:id", (req, res) => {
  const { roleName, department } = req.body;
  const { id } = req.params;

  if (!roleName || !department) {
    return res.status(ERROR_CODES.BAD_REQUEST.code).json({ message: "Role and department are required" });
  }

  db.query(
    "UPDATE userdetails SET roleName = ?, department = ? WHERE id = ?",
    [roleName, department, id],
    (err) => {
      if (err) return res.status(ERROR_CODES.SERVER_ERROR.code).json({ message: "Error updating role assignment" });
      return res.status(ERROR_CODES.SUCCESS.code).json({ message: "Role assigned successfully" });
    }
  );
});

// 🚫 404
app.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND.code).json({ message: ERROR_CODES.NOT_FOUND.message });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
