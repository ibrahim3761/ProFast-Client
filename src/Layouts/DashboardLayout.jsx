import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../Pages/Shared/Logo/Logo";
import {
  MdHome,
  MdLocalShipping,
  MdPayment,
  MdTrackChanges,
  MdPerson,
  MdCheckCircle,
  MdHourglassEmpty,
  MdAdminPanelSettings,
  MdDirectionsBike,
  MdPending,
  MdDone,
  MdAttachMoney,
} from "react-icons/md";
import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { role, isLoading } = useUserRole();
  console.log(role);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full  lg:hidden">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Logo></Logo>
          <li>
            <NavLink to="/">
              <MdHome className="inline mr-2" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myparcels">
              <MdLocalShipping className="inline mr-2" /> My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/paymetnHistory">
              <MdPayment className="inline mr-2" /> Payment History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track">
              <MdTrackChanges className="inline mr-2" /> Parcel Tracking
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile">
              <MdPerson className="inline mr-2" /> Update Profile
            </NavLink>
          </li>
          {/* rider links */}
          {!isLoading && role === "rider" && (
            <>
              <li>
                <NavLink to="/dashboard/pending-deliveries">
                  <MdPending className="inline mr-2" /> Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/completed-deliveries">
                  <MdDone className="inline mr-2" /> Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-earnings">
                  <MdAttachMoney className="inline mr-2" /> My Earnings
                </NavLink>
              </li>
            </>
          )}
          {/* admin links */}
          {!isLoading && role === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/assign-rider">
                  <MdDirectionsBike className="inline mr-2" /> Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/accepted-riders">
                  <MdCheckCircle className="inline mr-2" /> Accepted Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/pending-riders">
                  <MdHourglassEmpty className="inline mr-2" /> Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-admins">
                  <MdAdminPanelSettings className="inline mr-2" /> Manage Admins
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
