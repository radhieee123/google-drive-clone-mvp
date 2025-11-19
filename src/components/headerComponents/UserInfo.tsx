import React from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

function UserInfo({ setDisplayUserInfo }: UserInfoProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center
    space-y-3 rounded-2xl bg-darkC2 px-5 py-3 text-sm font-medium text-textC
    shadow-md shadow-[#b4bebb]"
    >
      <button
        onClick={() => setDisplayUserInfo((prev: boolean) => false)}
        className="absolute right-3 top-3 rounded-full bg-darkC2 p-1 hover:bg-darkC"
      >
        <AiOutlineClose className="h-5 w-5 rounded-full stroke-2 text-textC" />
      </button>
      <p>{user?.email}</p>
      <div className="h-20 w-20 overflow-hidden rounded-full border">
        {user?.image ? (
          <img
            src={user.image}
            className="h-full w-full object-cover"
            draggable={false}
            alt="avatar"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
      <h2 className="text-xl font-normal tablet:text-2xl">Hi, {user?.name}!</h2>
      <div className="flex space-x-1">
        <button
          onClick={handleLogout}
          className="flex w-36 items-center justify-center space-x-2 rounded-full bg-white px-3 py-3 hover:bg-darkC tablet:w-44"
        >
          <PiSignOutBold className="h-6 w-6" />
          <span>Sign out</span>
        </button>
      </div>
      <div className="flex h-10 items-center space-x-2 text-xs">
        <span>Privacy policy</span>
        <span className="-mt-[3px]"> . </span> <span>Terms of service</span>
      </div>
    </div>
  );
}

export default UserInfo;
