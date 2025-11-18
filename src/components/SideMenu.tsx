"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuthContext";
import { useRouter } from "next/router";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface Folder {
  id: string;
  folderName: string;
}

function SideMenu() {
  const [isDropDown, setIsDropDown] = useState(false);
  const [progress, setProgress] = useState([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const [folderName, setFolderName] = useState<string>("");
  const [folderToggle, setFolderToggle] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);

  const router = useRouter();
  const { Folder } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/folders", {
          headers: {
            "x-user-id": user?.id || "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }

        const folderList = await response.json();
        setFolders(folderList);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    if (user) {
      fetchFolders();
    }
  }, [user]);

  const navItems: NavItem[] = [
    {
      icon: (
        <svg
          className=" c-qd"
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="#000000"
          focusable="false"
        >
          <path d="M9.05 15H15q.275 0 .5-.137.225-.138.35-.363l1.1-1.9q.125-.225.1-.5-.025-.275-.15-.5l-2.95-5.1q-.125-.225-.35-.363Q13.375 6 13.1 6h-2.2q-.275 0-.5.137-.225.138-.35.363L7.1 11.6q-.125.225-.125.5t.125.5l1.05 1.9q.125.25.375.375T9.05 15Zm1.2-3L12 9l1.75 3ZM3 17V4q0-.825.587-1.413Q4.175 2 5 2h14q.825 0 1.413.587Q21 3.175 21 4v13Zm2 5q-.825 0-1.413-.587Q3 20.825 3 20v-1h18v1q0 .825-.587 1.413Q19.825 22 19 22Z"></path>
        </svg>
      ),
      label: "My Drive",
      path: "/drive/my-drive",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#1f1f1f"
        >
          <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
        </svg>
      ),
      label: "Shared with me",
      path: "/shared",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#1f1f1f"
        >
          <path d="m614-310 51-51-149-149v-210h-72v240l170 170ZM480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-630q30-70 82.5-122t122.46-82q69.96-30 149.5-30t149.55 30.24q70 30.24 121.79 82.08 51.78 51.84 81.99 121.92Q864-559.68 864-480q0 79.38-30 149.19T752-208.5Q700-156 629.87-126T480-96Zm0-384Zm.48 312q129.47 0 220.5-91.5Q792-351 792-480.48q0-129.47-91.02-220.5Q609.95-792 480.48-792 351-792 259.5-700.98 168-609.95 168-480.48 168-351 259.5-259.5T480.48-168Z" />
        </svg>
      ),
      label: "Recent",
      path: "/recent",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#1f1f1f"
        >
          <path d="m352-293 128-76 129 76-34-144 111-95-147-13-59-137-59 137-147 13 112 95-34 144ZM243-144l63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Zm237-333Z" />
        </svg>
      ),
      label: "Starred",
      path: "/drive/starred",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      ),
      label: "Trash",
      path: "/drive/trash",
    },
  ];

  const handleUploadFile = async (
    e: ChangeEvent<HTMLInputElement> | FileList,
    selectedFolderId?: string,
  ) => {
    const files = e instanceof FileList ? e : e.target.files || [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) {
        continue;
      }
      setFileName((prev) => [...prev, file.name]);

      try {
        const targetFolderId = selectedFolderId || (Folder?.[1] as string);

        await uploadFile(file, setProgress, targetFolderId);
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

  const storageUsed = 4.5;
  const storageTotal = 15;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#f9fafd]">
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
          folders={folders.map((f) => ({ id: f.id, name: f.folderName }))}
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

      <nav className="px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = router.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`
            group flex w-full items-center gap-5 rounded-r-full px-5 py-2
            transition-colors duration-200
            ${
              isActive
                ? "bg-[#c2e7ff] text-[#041e49]"
                : "text-[#5f6368] hover:bg-[#f1f3f4]"
            }
          `}
              >
                <div
                  className={`
              flex items-center justify-center
              ${
                isActive
                  ? "text-[#041e49]"
                  : "text-[#5f6368] group-hover:text-[#202124]"
              }
            `}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[14px] ${
                    isActive ? "font-medium" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div
        className="mx-6 border-t border-[#e8eaed]"
        style={{ marginTop: "2rem", paddingTop: "1rem" }}
      ></div>

      <div className="space-y-3 px-6">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[#5f6368]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3h-1v2h1c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z" />
          </svg>
          <span className="text-[14px] font-medium text-[#5f6368]">
            Storage
          </span>
        </div>

        <div className="relative">
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#e8eaed]">
            <div
              className="h-full rounded-full bg-[#1a73e8] transition-all duration-300"
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="text-[14px] text-[#5f6368]">
            {storageUsed} GB of {storageTotal} GB used
          </div>
          <button className="mt-2 text-[14px] font-medium text-[#1a73e8] hover:underline">
            Get more storage
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;
