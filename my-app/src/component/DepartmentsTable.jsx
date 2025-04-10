import React, { useEffect, useState } from "react";
import { Table, Button, Modal, FormControl, Form } from "react-bootstrap";
import axios from "axios";

const DepartmentsTable = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/departments");
      setDepartments(res.data.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return alert("Department name cannot be empty");
    try {
      await axios.post("http://localhost:5001/api/departments", {
        departmentName: newDepartment.trim(),
      });
      setNewDepartment("");
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      console.error("Error adding department", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert("Cannot delete department assigned to an employee");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post("http://localhost:5001/api/departments/bulk-delete", {
        ids: selected,
      });
      setSelected([]);
      fetchDepartments();
    } catch (err) {
      alert("Cannot delete one or more departments assigned to employees");
    }
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
        <h4 style={{ marginBottom: 0 }}>🏥 Departments Table</h4>
      </div>

      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <Button variant="success" onClick={() => setShowModal(true)}>
           Add Department
        </Button>
        {
          <Button variant="danger" onClick={handleBulkDelete}>
             Delete Selected
          </Button>
        }
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Checkbox</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.departmentID}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(dept.departmentID)}
                  onChange={() => handleCheckboxChange(dept.departmentID)}
                />
              </td>
              <td>{dept.departmentName}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(dept.departmentID)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Department Name</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter department name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentsTable;
