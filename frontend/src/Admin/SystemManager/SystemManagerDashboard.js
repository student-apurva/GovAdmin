import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  User,
  Bell,
  LogOut,
  Menu,
  Settings,
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  FileText,
  ShieldCheck
} from "lucide-react";

import DashboardPage from "./DashboardPage";
import ManagersPage from "./ManagersPage";
import DepartmentsPage from "./DepartmentsPage";
import AnalyticsPage from "./AnalyticsPage";
import ReportsPage from "./ReportsPage";

const pageTitles = {
  dashboard: "System Overview",
  managers: "Department Managers",
  departments: "Departments",
  analytics: "Analytics & Insights",
  reports: "System Reports",
};

export default function SystemManagerDashboard({ setUser }) {

  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [blink, setBlink] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("kmc_token");
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new_notification", (data) => {
      setNotifications(prev => [data, ...prev]);

      if (data.type === "urgent") {
        setBlink(true);
        setTimeout(() => setBlink(false), 1500);
      }
    });

    return () => socket.disconnect();
  }, []);

  /* ================= CLOCK ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".dropdownArea")) {
        setShowProfile(false);
        setShowNotif(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kmc_token");
    setUser(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "managers": return <ManagersPage />;
      case "departments": return <DepartmentsPage />;
      case "analytics": return <AnalyticsPage />;
      case "reports": return <ReportsPage />;
      default: return <DashboardPage />;
    }
  };

  const menuItems = [
    { label: "Dashboard", value: "dashboard", icon: <LayoutDashboard size={18}/> },
    { label: "Managers", value: "managers", icon: <Users size={18}/> },
    { label: "Departments", value: "departments", icon: <Building2 size={18}/> },
    { label: "Analytics", value: "analytics", icon: <BarChart3 size={18}/> },
    { label: "Reports", value: "reports", icon: <FileText size={18}/> },
  ];

  return (
    <div className="appContainer">

      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div>
          <div className="sidebarTop">
            <div className="brand">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/512px-Emblem_of_India.svg.png"
                alt="Emblem"
                className="emblem"
              />
              {!collapsed && (
                <div className="brandText">
                  <h2>Kolhapur Municipal Corporation</h2>
                  <p>System Manager Portal</p>
                </div>
              )}
            </div>

            <button
              className="collapseBtn"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20}/>
            </button>
          </div>

          <ul>
            {menuItems.map(item => (
              <li
                key={item.value}
                className={activePage === item.value ? "active" : ""}
                onClick={() => setActivePage(item.value)}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="logout" onClick={handleLogout}>
          <LogOut size={18}/>
          {!collapsed && <span>Secure Logout</span>}
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">

        {/* NAVBAR */}
        <header>
          <h1>{pageTitles[activePage]}</h1>

          <div className="rightHeader dropdownArea">

            {/* NOTIFICATIONS */}
            <div className="iconBox">
              <Bell
                size={20}
                className={blink ? "blinkBell" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotif(!showNotif);
                  setShowProfile(false);
                }}
              />

              {notifications.length > 0 && (
                <span className="badge">{notifications.length}</span>
              )}

              {showNotif && (
                <div className="dropdown">
                  <h4>Notifications</h4>
                  {notifications.map((n, index) => (
                    <div key={index} className="notifItem">
                      <p>{n.title}</p>
                      <small>{n.message}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="iconBox">
              <User
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfile(!showProfile);
                  setShowNotif(false);
                }}
              />

              {showProfile && profile && (
                <div className="dropdown">
                  <div className="profileTop">
                    <div className="avatar">
                      <ShieldCheck size={18}/>
                    </div>

                    <div className="profileDetails">
                      <h3>{profile.name}</h3>
                      <p>{profile.email}</p>

                      <div className="statusRow">
                        <span className={`statusDot ${profile.isOnline ? "online" : "offline"}`}></span>
                        <span>
                          {profile.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="dropdownOption">
                    <Settings size={16}/> Account Settings
                  </div>

                  <div className="dropdownOption logoutOption" onClick={handleLogout}>
                    <LogOut size={16}/> Secure Logout
                  </div>
                </div>
              )}
            </div>

            <div className="clock">
              <div>{dateTime.toLocaleTimeString()}</div>
              <small>{dateTime.toDateString()}</small>
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main>{renderPage()}</main>

      </div>

      {/* STYLES */}
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:Poppins, sans-serif; }

        html, body, #root {
          height:100%;
        }

        .appContainer {
          display:flex;
          height:100vh;
          width:100%;
          background:#f4f6fa;
        }

        .sidebar {
          width:260px;
          background:linear-gradient(180deg,#0b2c48,#071c2f);
          color:white;
          padding:20px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          transition:all 0.3s ease;
        }

        .sidebar.collapsed {
          width:80px;
        }

        .sidebarTop {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:30px;
        }

        .brand {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .emblem { width:38px; }

        .brandText h2 {
          font-size:15px;
          font-weight:600;
        }

        .brandText p {
          font-size:12px;
          opacity:0.7;
        }

        ul { list-style:none; }

        li {
          padding:12px;
          display:flex;
          align-items:center;
          gap:14px;
          border-radius:8px;
          cursor:pointer;
          margin-bottom:8px;
          transition:0.2s;
        }

        li:hover { background:rgba(255,153,51,0.2); }
        li.active { background:rgba(255,153,51,0.3); }

        .sidebar.collapsed li span { display:none; }
        .sidebar.collapsed li { justify-content:center; }

        .logout {
          background:#b91c1c;
          padding:10px;
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          cursor:pointer;
        }

        .main {
          flex:1;
          display:flex;
          flex-direction:column;
        }

        header {
          background:white;
          padding:20px 30px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          box-shadow:0 2px 10px rgba(0,0,0,0.08);
        }

        .rightHeader {
          display:flex;
          align-items:center;
          gap:25px;
        }

        .iconBox {
          position:relative;
          cursor:pointer;
        }

        .badge {
          position:absolute;
          top:-5px;
          right:-5px;
          background:red;
          color:white;
          font-size:10px;
          padding:2px 6px;
          border-radius:50%;
        }

        .dropdown {
          position:absolute;
          top:45px;
          right:0;
          width:280px;
          background:white;
          border-radius:12px;
          padding:15px;
          box-shadow:0 15px 40px rgba(0,0,0,0.15);
          animation:fade 0.2s ease;
        }

        @keyframes fade {
          from { opacity:0; transform:translateY(-8px); }
          to { opacity:1; transform:translateY(0); }
        }

        .blinkBell {
          animation: blinkRed 0.5s ease-in-out 3;
          color:red;
        }

        @keyframes blinkRed {
          0% { opacity:1; }
          50% { opacity:0; }
          100% { opacity:1; }
        }

        .notifItem {
          padding:8px 0;
          border-bottom:1px solid #eee;
        }

        .profileTop {
          display:flex;
          gap:12px;
          align-items:center;
        }

        .avatar {
          width:42px;
          height:42px;
          border-radius:50%;
          background:linear-gradient(135deg,#ff9933,#ff7a00);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
        }

        .divider {
          height:1px;
          background:#e5e7eb;
          margin:12px 0;
        }

        main {
          flex:1;
          padding:30px;
          overflow:auto;
        }

        .clock {
          font-size:12px;
          text-align:right;
        }
      `}</style>

    </div>
  );
}
