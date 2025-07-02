import React from "react";
import logo from "../../../assets/logo.png";
import { Link, NavLink } from "react-router";
const Logo = () => {
  return (
    <NavLink to='/'>
      <div className="flex items-end">
        <img className="mb-2 w-7" src={logo} alt="" />
        <p className="font-bold -ml-3 text-3xl">Profast</p>
      </div>
    </NavLink>
  );
};

export default Logo;
