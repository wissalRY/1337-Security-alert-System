import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";
import DarkMode from "../hooks/DarkMode";
import { IoLogOut } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import {
  FaUserSecret,
  FaInfoCircle,
  FaVideo,
  FaUserPlus,
} from "react-icons/fa";

const Header = () => {
  const [setTheme, colorTheme] = DarkMode();
  const idgard = localStorage.getItem("idgard");
  const navigate = useNavigate();
  const loginpath = "/login";
  const isAdmin = localStorage.getItem("isAdmin");
  Notification.requestPermission();

  useEffect(() => {
    if (idgard === null && window.location.pathname !== loginpath) {
      navigate(loginpath);
    }
  }, [navigate]);

  return (
    <div className=" container sticky top-0 flex items-center dark:shadow-md  dark:shadow-black  mx-auto left-0 right-0 py-4 justify-between text-xl  sm:text-lg  xsmm:px-[2%] smm:px-[5%]   px-[10%] max-w-full  dark:bg-dPrimary backdrop-blur-sm dark:text-primaryC z-50">
      <div className="">
        <Link to="/" className="font-bold relative group">
          <AiFillHome size={30} />
          <span className="absolute -right-4 w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
            Home
          </span>
        </Link>
      </div>
          
      <div className="flex items-center">
        {idgard != null && (
          <>
        <Link to="/Uknownfaces" className="relative group cursor-pointer">
          <FaUserSecret size={30} />
          <span className="absolute left-2 transform -translate-x-1/2    w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
            Unknown People
          </span>
        </Link>

        <Link to="/LiveCams" className="relative group ml-5 cursor-pointer">
          <FaVideo size={30} />
          <span className="absolute left-2 transform -translate-x-1/2    w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
            Live Cameras
          </span>
        </Link>
        {isAdmin && (
          <Link
            to="/adduser"
            className="relative group ml-5 cursor-pointer text-gray-900 dark:text-gray-200"
          >
            <FaUserPlus size={30} />
            <span className="absolute left-2 transform -translate-x-1/2    w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
              Add User
            </span>
          </Link>
          
        )}
                <Link to="/About" className="relative group ml-5 cursor-pointer">
          <FaInfoCircle size={30} />
          <span className="absolute left-2 transform -translate-x-1/2    w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
            About Us
          </span>
        </Link>
          <div className="relative group ml-5 cursor-pointer text-gray-900 dark:text-gray-200"
            onClick={() => {
              localStorage.removeItem("idgard");
              localStorage.removeItem("isAdmin");

              navigate(loginpath);
            }}
          >
            <IoLogOut
              size={30}
            />
            
            <span className="absolute left-2 transform -translate-x-1/2    w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
              Log Out
            </span>
            
          </div>
          
          </>
                  )}
        <div>
          <div
            className="relative group ml-5 cursor-pointer text-gray-900 dark:text-gray-200"
            onClick={() => {
              setTheme(colorTheme);
            }}
            >
            {colorTheme === "light" ? <BsSunFill size={24} /> : <BsFillMoonFill size={24}/>}
            <span className="absolute xsmm:hidden left-2 transform -translate-x-1/2    w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold  duration-300 opacity-0 group-hover:opacity-100">
              Theme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
