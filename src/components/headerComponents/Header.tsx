import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useMockAuth } from "@/contexts/MockAuthContext";
import {
  MdOutlineApps,
  MdOutlineNotifications,
  MdOutlineHelpOutline,
  MdSearch,
} from "react-icons/md";
import Search from "./Search";
import UserInfo from "./UserInfo";

function Header() {
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const { user, isAuthenticated } = useMockAuth();

  return (
    <header className="flex h-14 w-full items-center bg-white px-4 shadow-sm">
      <div className="flex min-w-[176px] items-center pr-3">
        <img
          src="/logo.png"
          alt="Drive"
          className="h-8 w-8"
          draggable={false}
        />
        <span className="ml-2 select-none font-sans text-[22px] font-semibold tracking-tight text-gray-800">
          Drive
        </span>
      </div>
      <div className="flex flex-1 justify-center">
        <div className="flex h-10 w-full max-w-2xl items-center rounded-[24px]">
          {isAuthenticated && <Search />}
        </div>
      </div>
      <div className="flex min-w-[140px] items-center justify-end gap-2">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <MdOutlineApps size={24} />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <MdOutlineNotifications size={24} />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <MdOutlineHelpOutline size={24} />
        </button>
        <div
          onClick={() => setDisplayUserInfo((prev) => !prev)}
          className="ml-1 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 hover:bg-gray-300"
        >
          {user && user.image ? (
            <img
              src={user.image}
              className="h-full w-full object-cover"
              draggable={false}
              alt="avatar"
            />
          ) : (
            <FaUserCircle className="h-full w-full text-gray-500" />
          )}
        </div>
        <div className="absolute right-5 top-16">
          {isAuthenticated && displayUserInfo && (
            <UserInfo setDisplayUserInfo={setDisplayUserInfo} />
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
