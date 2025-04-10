import React from "react";
import { Dropdown, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const ProfileDropdown = ({ user, handleLogout }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="profile-dropdown">
        <FaUserCircle style={{ marginRight: "8px" }} />
        {user?.username || "Profile"}
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item disabled>
          <strong>{user?.name || "Loading..."}</strong>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Username: {user?.username}</Dropdown.Item>
        <Dropdown.Item>Email: {user?.email}</Dropdown.Item>
        <Dropdown.Item>Phone: {user?.phone}</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;