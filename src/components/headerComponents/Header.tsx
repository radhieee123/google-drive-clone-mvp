"use client";
import React, { useState } from "react";
import { TbGridDots } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuthContext";
import Search from "./Search";
import UserInfo from "./UserInfo";

function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between bg-[#f9fafd] px-4">
      <div className="flex w-[16%] items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Drive"
            className="h-10 w-10"
            draggable={false}
          />

          <span className="text-[22px] text-[#5f6368]">Drive</span>
        </div>
      </div>

      <div className="justify-left flex flex-1">
        <div
          className={`flex w-full max-w-[720px] items-center rounded-lg transition-all ${
            searchFocused
              ? "bg-white shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)]"
              : ""
          }`}
        >
          {isAuthenticated && <Search />}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f1f3f4]">
          <svg
            className="wo35tf"
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="#000000"
            focusable="false"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
          </svg>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f1f3f4]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#1f1f1f"
          >
            <path d="m403-96-22-114q-23-9-44.5-21T296-259l-110 37-77-133 87-76q-2-12-3-24t-1-25q0-13 1-25t3-24l-87-76 77-133 110 37q19-16 40.5-28t44.5-21l22-114h154l22 114q23 9 44.5 21t40.5 28l110-37 77 133-87 76q2 12 3 24t1 25q0 13-1 25t-3 24l87 76-77 133-110-37q-19 16-40.5 28T579-210L557-96H403Zm59-72h36l19-99q38-7 71-26t57-48l96 32 18-30-76-67q6-17 9.5-35.5T696-480q0-20-3.5-38.5T683-554l76-67-18-30-96 32q-24-29-57-48t-71-26l-19-99h-36l-19 99q-38 7-71 26t-57 48l-96-32-18 30 76 67q-6 17-9.5 35.5T264-480q0 20 3.5 38.5T277-406l-76 67 18 30 96-32q24 29 57 48t71 26l19 99Zm18-168q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102q0 60 42 102t102 42Zm0-144Z" />
          </svg>
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f1f3f4]">
          <TbGridDots className="h-5 w-5 text-[#5f6368]" />
        </button>

        <button
          onClick={() => setDisplayUserInfo((prev) => !prev)}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ea4335] text-sm font-medium text-white hover:ring-2 hover:ring-gray-300"
        >
          {user?.email?.[0]?.toUpperCase() || "U"}
        </button>
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
