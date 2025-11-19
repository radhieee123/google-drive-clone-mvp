"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TbGridDots } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";
import Search from "./Search";
import UserInfo from "./UserInfo";
import { QuestionIcon, SettingsIcon } from "@/components/FileIcons";

function Header() {
  const [searchFocused] = useState(false);
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between bg-[#f9fafd] px-4">
      <div className="flex w-[16%] items-center gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Drive"
            width={40}
            height={40}
            className="h-10 w-10"
            draggable={false}
            priority
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
          <QuestionIcon />
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f1f3f4]">
          <SettingsIcon />
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
