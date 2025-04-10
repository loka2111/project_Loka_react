import React, { useEffect, useState } from "react";
import { Table, Button, FormControl, Form, Modal } from "react-bootstrap";
import axios from "axios";

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showModal, setShowModal] = useState(false); // 👈 For modal

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/roles");
      setRoles(response.data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to fetch roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      return alert("Role name is required");
    }

    try {
      await axios.post("http://localhost:5001/api/roles", {
        roleName: newRoleName.trim(),
      });
      setNewRoleName("");
      setShowModal(false); // 👈 Close modal
      fetchRoles();
    } catch (err) {
      console.error("Add Role Error:", err);
      alert(err.response?.data?.message || "Error adding role");
    }
  };

  const handleDelete = async (roleID) => {
    try {
      await axios.delete(`http://localhost:5001/api/roles/${roleID}`);
      fetchRoles();
    } catch (err) {
      console.error("Delete Role Error:", err);
      alert(err.response?.data?.message || "Cannot delete role");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post("http://localhost:5001/api/roles/bulk-delete", {
        roleIDs: selectedRoles,
      });
      setSelectedRoles([]);
      fetchRoles();
    } catch (err) {
      console.error("Bulk Delete Error:", err);
      alert(err.response?.data?.message || "Cannot delete selected roles");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

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
        <h4 style={{ marginBottom: 0 }}>🎭 Roles Management</h4>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "10px" }}>
        <Button variant="success" onClick={() => setShowModal(true)}>
           Add Role
        </Button>
        {
          <Button variant="danger" onClick={handleBulkDelete}>
             Delete Selected
          </Button>
        }
      </div>

      <Table bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th style={{ width: "60px" }}>✔</th>
            <th>Role Name</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length ? (
            roles.map((role) => (
              <tr key={role.roleID}>
                <td className="text-center">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(role.roleID)}
                    checked={selectedRoles.includes(role.roleID)}
                  />
                </td>
                <td>{role.roleName}</td>
                <td className="text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(role.roleID)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No roles available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 👉 Modal for Adding Role */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#343a40", color: "white" }}>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Role Name</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddRole}>
            Add Role
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RolesTable;
