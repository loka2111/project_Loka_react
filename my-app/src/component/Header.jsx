import React from "react";
import { Container } from "react-bootstrap";
import { FaSearch, FaUserCircle, FaCog } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

const Header = ({
  user,
  toggleSidebar,
  handleLogout,
  companyName = "Hospital Management",
  pageHeader = "Dashboard",
  searchTerm,
  setSearchTerm,
  userDetails,
  setUserDetails,
  showSettings,
  setShowSettings,
  showProfileInfo,
  setShowProfileInfo,
  refresh,
}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Container fluid>
        <i
          className="bi bi-list"
          style={{
            color: "white",
            fontSize: "35px",
            marginRight: "30px",
            cursor: "pointer",
          }}
          onClick={toggleSidebar}
        ></i>

        <a className="navbar-brand" href="#">
          {companyName} - {pageHeader}
        </a>

        {/* Right Side: Search, Refresh, Settings, Profile */}
        <div className="ms-auto d-flex align-items-center gap-3 position-relative">
          {/* Search */}
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Refresh */}
          <button
            className="btn btn-outline-light"
            title="Refresh"
            onClick={refresh}
          >
            <i className="bi bi-arrow-clockwise" style={{ fontSize: "1.3rem" }}></i>
          </button>

          {/* Settings Icon */}
          <FaCog
            size={24}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowProfileInfo(false);
              setShowSettings((prev) => !prev);
            }}
          />

          {/* Profile Icon */}
          <FaUserCircle
            size={28}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowSettings(false);
              setShowProfileInfo((prev) => !prev);
            }}
          />

          {/* Profile Info Dropdown */}
          {showProfileInfo && (
            <div
              className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow"
              style={{ minWidth: "200px", zIndex: 10 }}
            >
              <p className="mb-1">
                <strong>Username:</strong> {userDetails?.username}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {userDetails?.email}
              </p>
              <button className="btn btn-sm btn-outline-danger mt-2" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {/* Settings Dropdown */}
          {showSettings && (
            <div
              className="position-absolute top-100 end-0 bg-white text-dark p-3 mt-2 rounded shadow"
              style={{ minWidth: "250px", zIndex: 10 }}
            >
              <h6 className="text-center">Edit Profile</h6>
              <div className="mb-2">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={userDetails.username}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </div>
              <button className="btn btn-sm btn-primary w-100">Save Changes</button>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default Header;
