// Sidebar.js
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

const Sidebar = ({ isOpen, toggleSidebar, setActiveView }) => {
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  return (
    <div className={`slide-menu ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        <i className="bi bi-arrow-bar-left" style={{ color: "white", fontSize: "40px" }}></i>
      </button>

      <ul className="nav flex-column mt-4">
        <li className="nav-item mt-5">
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveView("");
              toggleSidebar();
            }}
          >
            🏠 Home
          </span>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#about">ℹ️ About Us</a>
        </li>

        <li className="nav-item">
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => setIsRolesOpen(!isRolesOpen)}
          >
            👥 Roles{" "}
            <i className={`bi ${isRolesOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
          </span>

          {isRolesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => setActiveView("roles")}>
                  📋 Roles Table
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => setActiveView("departments")}>
                  🏢 Departments Table
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => setActiveView("assign")}>
                  🔄 Role Assign Table
                </span>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
