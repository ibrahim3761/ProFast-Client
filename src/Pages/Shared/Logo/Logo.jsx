import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";
const Logo = () => {
  return (
    <Link>
      <div className="flex items-end">
        <img className="mb-2 w-7" src={logo} alt="" />
        <p className="font-bold -ml-3 text-3xl">Profast</p>
      </div>
    </Link>
  );
};

export default Logo;
