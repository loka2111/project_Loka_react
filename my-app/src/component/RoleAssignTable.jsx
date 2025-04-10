import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, FormControl, Form, Modal,InputGroup } from "react-bootstrap";

const RoleAssignTable = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedRole, setUpdatedRole] = useState("");
  const [updatedDept, setUpdatedDept] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5001/api/userdetails", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const fetchRoles = () => {
    axios
      .get("http://localhost:5001/api/roles")
      .then((res) => setRoles(res.data.data))
      .catch((err) => console.error("Error fetching roles:", err));
  };

  const fetchDepartments = () => {
    axios
      .get("http://localhost:5001/api/departments")
      .then((res) => setDepartments(res.data.data))
      .catch((err) => console.error("Error fetching departments:", err));
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUpdatedRole(user.roleName || "");
    setUpdatedDept(user.department || "");
    setShowModal(true);
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:5001/api/userdetails/${selectedUser.id}`,
        { roleName: updatedRole, department: updatedDept },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setShowModal(false);
        fetchUsers();
      })
      .catch((error) => {
        console.error("Update error:", error);
        alert("Failed to update role and department.");
      });
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.username} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem", marginTop: "1.5rem" }}>
      <div
        style={{
          backgroundColor: "#343a40",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: 0 }}>🛡️ Role Assignment</h4>
      </div>

      <InputGroup className="mb-4 shadow-sm" style={{ maxWidth: "400px" }}>
        <FormControl
          placeholder="Search by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Role</th>
            <th>Department</th>
            <th style={{ width: "100px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.username}</td>
                <td>{user.roleName || "Not assigned"}</td>
                <td>{user.department || "Not assigned"}</td>
                <td className="text-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Assign
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Role & Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Employee Name</Form.Label>
              <Form.Control type="text" value={selectedUser?.name} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Role</Form.Label>
              <Form.Select
                value={updatedRole}
                onChange={(e) => setUpdatedRole(e.target.value)}
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role.roleID} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Department</Form.Label>
              <Form.Select
                value={updatedDept}
                onChange={(e) => setUpdatedDept(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option
                    key={dept.departmentID}
                    value={dept.departmentName}
                  >
                    {dept.departmentName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleAssignTable;
