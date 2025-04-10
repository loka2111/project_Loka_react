import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await axios.get("/api/roles");
    setRoles(res.data);
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) return;
    await axios.post("/api/roles", { roleName: newRole });
    setNewRole("");
    fetchRoles();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/roles/${id}`);
      fetchRoles();
    } catch (error) {
      alert("Cannot delete role assigned to an employee.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post("/api/roles/bulk-delete", { ids: selectedIds });
      setSelectedIds([]);
      fetchRoles();
    } catch (error) {
      alert("Cannot delete one or more selected roles.");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mt-4">
      <h2>Role Management</h2>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Enter role name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <Button onClick={handleAddRole}>Add Role</Button>
      </InputGroup>

      {selectedIds.length > 1 && (
        <Button variant="danger" className="mb-2" onClick={handleBulkDelete}>
          Delete Selected
        </Button>
      )}

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th><Form.Check type="checkbox" disabled /></th>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.roleID}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.includes(role.roleID)}
                  onChange={() => toggleSelect(role.roleID)}
                />
              </td>
              <td>{role.roleName}</td>
              <td>
                <BsTrash
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(role.roleID)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Roles;
