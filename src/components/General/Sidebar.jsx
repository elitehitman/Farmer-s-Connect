import React from "react";
import { Link } from "react-router-dom";
import logo from "../Data/logo.png";

const Sidebar = () => {
  let role = localStorage.getItem("role");

  return (
    <div className="w-64 fixed left-0 top-0 bg-gray-800 text-white h-screen flex flex-col">
      <div className="flex justify-center items-center py-6">
        <img src={logo} alt="Logo" className="w-36 h-36" />
      </div>
      <nav className="flex-1">
        <ul className="space-y-6 px-4">
          <li>
            <Link
              to="/profile"
              className="block py-3 px-4 rounded-md text-lg hover:bg-gray-700"
            >
              Profile
            </Link>
          </li>
          {role === "buyer" ? (
            <li>
              <Link
                to="/farmer-network"
                className="block py-3 px-4 rounded-md text-lg hover:bg-gray-700"
              >
                Farmer Network
              </Link>
            </li>
          ) : (
            <li></li>
          )}

          <li>
            <Link
              to="/contract"
              className="block py-3 px-4 rounded-md text-lg hover:bg-gray-700"
            >
              Contract
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
