import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";
import {
  BellIcon,
  LogOutIcon,
  ShipWheelIcon,
  MenuIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ onMenuClick }) => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
console.log(onMenuClick)
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={onMenuClick}
            className="btn btn-ghost btn-circle lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-7 text-primary" />
            <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatzaN
            </span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle">
              <BellIcon className="h-6 w-6 opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          <button
            className="btn btn-ghost btn-circle"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-6 w-6 opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
