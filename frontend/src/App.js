import { useState } from "react";
import AdminLogin from "./Admin/Login";
import SystemManagerDashboard from "./Admin/SystemManagerDashboard";
import DepartmentManagerDashboard from "./Admin/DepartmentManagerDashboard";

function App() {
  const [user, setUser] = useState(null);

  // NOT LOGGED IN
  if (!user) {
    return <AdminLogin setUser={setUser} />;
  }

  // SYSTEM MANAGER
  if (user.role === "system_manager") {
    return <SystemManagerDashboard setUser={setUser} />;
  }

  // DEPARTMENT MANAGER
  return (
    <DepartmentManagerDashboard
      department={user.department}
      setUser={setUser}
    />
  );
}

export default App;
