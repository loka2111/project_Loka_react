import React, { useEffect,useState } from "react";
import Sidebar from "./sidebar";
import RolesTable from "./RolesTable";
import DepartmentsTable from "./DepartmentsTable";
import RoleAssignTable from "./RoleAssignTable";
import Header from "./Header";
import hospitalImage from"../image/hospitalBG1.jpg";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [showSettings, setShowSettings] = useState(false);
    const [showProfileInfo, setShowProfileInfo] = useState(false);
  
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userInfo = JSON.parse(localStorage.getItem("userDetails")); // assuming you store { id, username, etc }
      
        if (!userInfo?.id || !token) return;
      
        const fetchUserDetails = async () => {
          try {
            const res = await fetch(`/api/userdetails/${userInfo.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const result = await res.json();
      
            if (res.ok) {
              setUserDetails(result.data);
            } else {
              console.error("Failed to fetch user details:", result.message);
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        };
      
        fetchUserDetails();
      }, []);
      
      const divStyle = {
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${hospitalImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
      window.location.reload();
    };
  
    const renderContent = () => {
      switch (activeView) {
        case "roles":
          return <RolesTable searchTerm={searchTerm} />;
        case "departments":
          return <DepartmentsTable searchTerm={searchTerm} />;
        case "assign":
          return <RoleAssignTable searchTerm={searchTerm} />;
        default:
          return (
            // <div
            //   style={{
            //     background: "#f8f9fa",
            //     padding: "2rem",
            //     borderRadius: "0.5rem",
            //     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            //     textAlign: "center",
            //     fontSize: "1.5rem",
            //     color: "#343a40",
            //   }}
            // >
            //   Welcome to Hospital
            // </div>
            <div style={divStyle}></div>
          );
      }
    };
  
    return (
      <div>
        <Header
          user={userDetails}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          handleLogout={handleLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          showProfileInfo={showProfileInfo}
          setShowProfileInfo={setShowProfileInfo}
          refresh={() => setActiveView("home")}
        />
  
        <div className="d-flex" style={{ paddingTop: "70px" }}>
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              setActiveView={(view) => {
                setActiveView(view);
                setIsSidebarOpen(false);
              }}
            />
          )}
          <div className="flex-grow-1 p-4">{renderContent()}</div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;