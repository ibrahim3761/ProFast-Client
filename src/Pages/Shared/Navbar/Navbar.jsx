import React from "react";
import { Link, NavLink } from "react-router";
import Logo from "../Logo/Logo";
import useAuth from "../../../Hooks/useAuth.JSX";

const Navbar = () => {
  const { user, logOut } = useAuth(); // assuming logOut is available from context

  const handleSignOut = async () => {
    logOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  const navItems = (
  <>
    <li>
      <NavLink
        to="/services"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        Services
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/sendParcel"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        Send Parcel
      </NavLink>
    </li>
    {
      user && <>
        <li>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        Dashboard
      </NavLink>
    </li>
      </>
    }
    <li>
      <NavLink
        to="/coverage"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        Coverage
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        About Us
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/pricing"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        Pricing
      </NavLink>
    </li>
    <li className="lg:hidden">
      <NavLink
        to="/beARider"
        className={({ isActive }) =>
          isActive
            ? "bg-[#CAEB66] text-black font-semibold rounded-full px-4 py-2"
            : "px-4 py-2"
        }
      >
        Be a Rider
      </NavLink>
    </li>
  </>
);

  return (
    <div className="px-2 md:px-6">
      <div className="navbar bg-base-100 shadow-sm rounded-3xl pr-6">
        {/* Left side: Logo and Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              {navItems}
              <li className="block lg:hidden mt-2">
                <Link
                  to="/be-a-rider"
                  className="btn bg-[#CAEB66] text-black font-semibold w-full"
                >
                  Be a rider
                </Link>
              </li>
            </ul>
          </div>
          <span className="ml-4">
            <Logo />
          </span>
        </div>

        {/* Center nav items */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navItems}
          </ul>
        </div>

        {/* Right side: Sign in / out and "Be a rider" button */}
        <div className="navbar-end space-x-3">
          {user ? (
            <button
              onClick={handleSignOut}
              className="btn btn-outline rounded-lg px-5 min-h-[2.5rem] h-10 text-sm"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline rounded-lg px-5 min-h-[2.5rem] h-10 text-sm"
            >
              Sign In
            </Link>
          )}

          {/* Be a rider: visible on lg+ only */}
          <Link
            to="/beARider"
            className="btn bg-[#CAEB66] text-black font-semibold rounded-full px-5 min-h-[2.5rem] h-10 hidden lg:inline-flex"
          >
            Be a rider
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
