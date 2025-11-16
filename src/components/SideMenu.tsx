"use client";
import React, { useState, ChangeEvent } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import {
  AiOutlineClockCircle,
  AiOutlineStar,
  AiOutlineDelete,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { BsFolder2, BsPeople, BsLaptop, BsInfoCircle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import DropDown from "./addBtnComponents/DropDown";
import AddFolder from "./addBtnComponents/AddFolder";
import { uploadFile } from "../lib/fileUpload";
import ProgressIndicator from "./ProgressIndicator";
import { addFolder } from "@/lib/api-client";
import { useMockAuth } from "@/contexts/MockAuthContext";
import { useRouter } from "next/router";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

function SideMenu() {
  const [isDropDown, setIsDropDown] = useState(false);
  const [progress, setProgress] = useState([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const [folderName, setFolderName] = useState<string>("");
  const [folderToggle, setFolderToggle] = useState(false);

  const router = useRouter();
  const { Folder } = router.query;
  const { user } = useMockAuth();

  const navItems: NavItem[] = [
    {
      icon: <BsFolder2 className="h-5 w-5" />,
      label: "My Drive",
      path: "/drive/my-drive",
    },
    {
      icon: <BsPeople className="h-5 w-5" />,
      label: "Shared with me",
      path: "/shared",
    },
    {
      icon: <AiOutlineClockCircle className="h-5 w-5" />,
      label: "Recent",
      path: "/recent",
    },
    {
      icon: <AiOutlineStar className="h-5 w-5" />,
      label: "Starred",
      path: "/drive/starred",
    },
    {
      icon: <AiOutlineDelete className="h-5 w-5" />,
      label: "Trash",
      path: "/drive/trash",
    },
  ];

  const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    for (let i = 0; i < files.length; i++) {
      const file = files?.[i];
      if (!file) return;

      setFileName((prev) => [...prev, file.name]);

      try {
        await uploadFile(file, setProgress, Folder?.[1] as string);
      } catch (error) {
        console.error("Upload error:", error);
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleUploadFolder = async () => {
    try {
      const name = folderName === "" ? "Untitled folder" : folderName;
      await addFolder(name, Folder?.[1] as string);
      setFolderName("");
      window.location.reload();
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    }
  };

  const displayFileNames = [...fileName].reverse();
  const displayProgress = [...progress].reverse();

  const storageUsed = 4.5; // GB
  const storageTotal = 15; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <aside className="relative flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="p-3">
        <button
          onClick={() => setIsDropDown(true)}
          className="group flex items-center rounded-2xl bg-white px-3 py-1 
          shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]
          transition-all duration-200 hover:bg-[#f8f9fa]
          hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] active:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]"
        >
          <div className="flex h-10 w-10 items-center justify-center">
            <HiOutlinePlusSm className="h-6 w-6 text-[#5f6368]" />
          </div>
          <span className="text-sm font-medium text-[#3c4043]">New</span>
        </button>
      </div>

      {isDropDown && (
        <DropDown
          setFolderToggle={setFolderToggle}
          uploadFile={handleUploadFile}
          setIsDropDown={setIsDropDown}
        />
      )}

      <ProgressIndicator
        progress={displayProgress}
        fileName={displayFileNames}
        setFileName={setFileName}
      />

      {folderToggle && (
        <AddFolder
          setFolderToggle={setFolderToggle}
          setFolderName={setFolderName}
          uploadFolder={handleUploadFolder}
        />
      )}

      <nav className="flex-2 space-y-1 px-3 py-2">
        {navItems.map((item, index) => {
          const isActive = router.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className={`
                group flex w-full items-center gap-5 rounded-full px-6 py-2.5
                transition-all duration-150
                ${
                  isActive
                    ? "bg-[#e8f0fe] font-medium text-[#1a73e8]"
                    : "text-[#5f6368] hover:bg-[#f1f3f4]"
                }
              `}
            >
              <div
                className={`
                flex items-center justify-center
                ${
                  isActive
                    ? "text-[#1a73e8]"
                    : "text-[#5f6368] group-hover:text-[#202124]"
                }
              `}
              >
                {item.icon}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "font-medium" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mx-6 border-t border-gray-200"></div>

      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AiOutlineCloudUpload className="h-5 w-5 text-[#5f6368]" />
            <span className="text-sm text-[#5f6368]">Storage</span>
          </div>
          <BsInfoCircle className="h-4 w-4 cursor-pointer text-[#5f6368] hover:text-[#202124]" />
        </div>

        <div className="w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#1a73e8] transition-all duration-300"
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-[#5f6368]">
          {storageUsed} GB of {storageTotal} GB used
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;
