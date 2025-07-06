import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useUserRole from "../../../Hooks/useUserRole";
import AdminDash from "./AdminDash";
import RiderDash from "./RiderDash";
import UserDash from "./UserDash";


const DashboardHome = () => {
  const { user } = useAuth(); 
  const {role } = useUserRole();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.displayName || "User"}!</h2>

      {role === "admin" && (
        <AdminDash></AdminDash>
      )}

      {role === "rider" && (
        <RiderDash></RiderDash>
      )}

      {role === "user" && (
        <UserDash></UserDash>
      )}
    </div>
  );
};

export default DashboardHome;
