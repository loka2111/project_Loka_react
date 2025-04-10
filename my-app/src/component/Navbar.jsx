import React, { useState, useEffect } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import RolesTable from "./RolesTable";
import DepartmentsTable from "./DepartmentsTable";
import RoleAssignTable from "./RoleAssignTable";


const AppNavbar = ({ user, handleLogout, setSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSubmenu, setShowRoleSubmenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("home");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setSidebarOpen(!isOpen);
  };

  useEffect(() => {
    const savedMenu = localStorage.getItem("selectedMenu");
    if (savedMenu) {
      setSelectedMenu(savedMenu);
    }
  }, []);

  const handleNavClick = (menu) => {
    setSelectedMenu(menu);
    localStorage.setItem("selectedMenu", menu);
    setIsOpen(false);
    setShowRoleSubmenu(false);
    setSidebarOpen(false);
  };

  const handleSelectRolesClick = () => {
    setShowRoleSubmenu(!showRoleSubmenu);
  };

  const adminMenuItems = [
    { key: "roles", label: "Roles" },
    { key: "departments", label: "Departments" },
    { key: "roleassign", label: "Role Assign" },
  ];

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="w-100 px-3 py-2">
        <Container>
          <Button variant="light" onClick={toggleSidebar} style={{ position: "absolute", left: "10px" }}>
            <FaBars />
          </Button>

          {/* Sidebar Navigation */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              width: "250px",
              backgroundColor: "#343a40",
              padding: "15px",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s ease-in-out",
              transform: isOpen ? "translateX(0)" : "translateX(-110%)",
              borderRadius: "0 10px 10px 0",
              zIndex: "1000",
              color: "white",
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ cursor: "pointer", padding: "8px" }} onClick={() => handleNavClick("home")}>
                Home
              </li>
              <li style={{ cursor: "pointer", padding: "8px" }} onClick={() => handleNavClick("about")}>
                About
              </li>
              <li style={{ cursor: "pointer", padding: "8px" }} onClick={handleSelectRolesClick}>
                Admin Menu ▾
              </li>

              {showRoleSubmenu && (
                <ul style={{ listStyle: "none", paddingLeft: "15px", marginTop: "5px" }}>
                  {adminMenuItems.map((item) => (
                    <li
                      key={item.key}
                      onClick={() => handleNavClick(item.key)}
                      style={{
                        cursor: "pointer",
                        padding: "6px 8px",
                        backgroundColor: selectedMenu === item.key ? "#007bff" : "transparent",
                        color: selectedMenu === item.key ? "white" : "inherit",
                        borderRadius: "5px",
                      }}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </ul>
          </div>

          <Navbar.Brand className="mx-auto">S.R Restaurant</Navbar.Brand>
          <ProfileDropdown user={user} handleLogout={handleLogout} />
        </Container>
      </Navbar>

      {/* Component Switching */}
      {selectedMenu === "roles" && <RolesTable />}
      {selectedMenu === "departments" && <DepartmentsTable />}
      {selectedMenu === "roleassign" && <RoleAssignTable />}
    </>
  );
};

export default AppNavbar;