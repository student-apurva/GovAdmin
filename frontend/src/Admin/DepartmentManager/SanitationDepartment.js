import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Bell,
  UserCircle,
  Plus,
} from "lucide-react";
import AddOfficer from "../../shared/AddOfficer";

const SanitationDepartment = () => {
  const [page, setPage] = useState("Dashboard");
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAddOfficer, setShowAddOfficer] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= OFFICERS ================= */
  const [officers, setOfficers] = useState([
    { empId: "EMP-101", fullName: "Rahul Patil" },
    { empId: "EMP-102", fullName: "Amit Deshmukh" },
    { empId: "EMP-103", fullName: "Sanjay Kulkarni" },
  ]);

  /* ================= COMPLAINTS ================= */
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Garbage not collected",
      ward: "Ward 3",
      status: "Pending",
      assignedTo: "Rahul Patil",
      createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
    },
    {
      id: 2,
      title: "Overflowing dustbin",
      ward: "Ward 7",
      status: "Resolved",
      assignedTo: "",
      createdAt: new Date(),
    },
  ]);

  /* ================= SLA ================= */
  const getSLA = (createdAt, status) => {
    const hours =
      (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);

    if (status === "Resolved")
      return { label: "Resolved", color: "#16a34a" };

    if (hours > 48)
      return { label: "Escalated", color: "#dc2626" };

    if (hours > 24)
      return { label: "Warning", color: "#f59e0b" };

    return { label: "Normal", color: "#22c55e" };
  };

  /* ================= OFFICER STATUS ================= */
  const isOfficerBusy = (officerName) => {
    return complaints.some(
      c =>
        c.assignedTo === officerName &&
        c.status !== "Resolved"
    );
  };

  /* ================= HANDLERS ================= */
  const handleAssign = (id, officer) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, assignedTo: officer } : c
      )
    );
  };

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending = complaints.filter(c => c.status === "Pending").length;

  return (
    <div style={{
      height: "100vh",
      background: "#f3f4f6",
      fontFamily: "Segoe UI",
      color: "#1f2937"
    }}>

      {/* ================= NAVBAR ================= */}
      <header style={{
        background: "#16a34a",
        color: "#fff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ margin: 0 }}>KMC – Sanitation Command Center</h2>

        <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
          <div style={{
            background: "#fff",
            color: "#16a34a",
            padding: "8px 18px",
            borderRadius: 8,
            fontWeight: 600
          }}>
            {time.toLocaleTimeString("en-IN")}
          </div>
          <Bell size={22} />
          <UserCircle size={28} />
        </div>
      </header>

      <div style={{ display: "flex", height: "calc(100vh - 90px)" }}>

        {/* ================= SIDEBAR ================= */}
        <aside style={{
          width: 260,
          background: "#ffffff",
          padding: 30,
          borderRight: "1px solid #e5e7eb"
        }}>
          {[
            { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
            { name: "Complaints", icon: <FileText size={18} /> },
            { name: "Officer Status", icon: <Users size={18} /> },
            { name: "Audit Logs", icon: <ClipboardList size={18} /> },
            { name: "Analytics", icon: <Users size={18} /> },
          ].map(item => (
            <div
              key={item.name}
              onClick={() => {
                setPage(item.name);
                setShowAddOfficer(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
                cursor: "pointer",
                background: page === item.name ? "#dcfce7" : "transparent",
                fontWeight: page === item.name ? 600 : 500
              }}
            >
              {item.icon}
              {item.name}
            </div>
          ))}
        </aside>

        {/* ================= MAIN ================= */}
        <main style={{
          flex: 1,
          padding: 50,
          overflowY: "auto"
        }}>

          {/* DASHBOARD */}
          {page === "Dashboard" && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 30
            }}>
              {[{
                label: "Total Complaints", value: total
              },{
                label: "Resolved", value: resolved
              },{
                label: "Pending", value: pending
              }].map((stat, i) => (
                <div key={i} style={{
                  background: "#fff",
                  padding: 40,
                  borderRadius: 20,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                }}>
                  <p>{stat.label}</p>
                  <h1 style={{ color: "#16a34a", fontSize: 42 }}>
                    {stat.value}
                  </h1>
                </div>
              ))}
            </div>
          )}

          {/* OFFICER STATUS PAGE */}
          {page === "Officer Status" && (
            <>
              {!showAddOfficer ? (
                <div style={{
                  background: "#fff",
                  padding: 40,
                  borderRadius: 20,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
                }}>
                  {/* Header with Button */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 30
                  }}>
                    <h3 style={{ margin: 0 }}>Officer Work Status</h3>

                    <button
                      onClick={() => setShowAddOfficer(true)}
                      style={{
                        background: "#16a34a",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: 10,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 600
                      }}
                    >
                      <Plus size={18} />
                      Add Officer
                    </button>
                  </div>

                  {/* Officer List */}
                  {officers.map(o => {
                    const busy = isOfficerBusy(o.fullName);

                    return (
                      <div key={o.empId} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px 0",
                        borderBottom: "1px solid #f1f1f1"
                      }}>
                        <span style={{ fontSize: 16 }}>
                          {o.fullName}
                        </span>

                        <span style={{
                          background: busy ? "#dc2626" : "#16a34a",
                          color: "#fff",
                          padding: "6px 14px",
                          borderRadius: 20,
                          fontWeight: 600,
                          fontSize: 13
                        }}>
                          {busy ? "Working" : "Free"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <AddOfficer onBack={() => setShowAddOfficer(false)} />
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default SanitationDepartment;
