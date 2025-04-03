import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import amana from "../assets/amana.png";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ setAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  const handleOutsideClick = (event) => {
    if (!event.target.closest("#account-menu")) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <nav className="bg-[#E9DFC3] p-4 shadow-lg border-b-2 border-[#fcb040]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <img src={amana} alt="Logo" className="h-20 object-contain" />

        {/* Account Dropdown */}
        <div id="account-menu" className="relative">
          {/* Account Icon (Click to Toggle) */}
          <FaUserCircle
            className="text-4xl text-[#27724D] cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />

          {/* Logout Button (Dropdown) */}
          {isOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-36 py-2 text-center">
              <button
                onClick={() => {
                  logout(); // Clears auth token
                  setAuth(false); // 🔹 Force re-render by updating auth state
                  navigate("/"); // Redirect to login
                }}
                className="block w-full px-4 py-2 text-red-600 hover:bg-red-100 text-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
