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
import { useMockAuth } from "@/contexts/MockAuthContext";
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
  const { user } = useMockAuth();

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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </svg>
      ),
      label: "My Drive",
      path: "/drive/my-drive",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
      label: "Shared with me",
      path: "/shared",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      ),
      label: "Recent",
      path: "/recent",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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
    console.log("handleUploadFile called");
    console.log("Event/FileList:", e);
    console.log("Selected folder ID:", selectedFolderId);

    const files = e instanceof FileList ? e : e.target.files || [];

    console.log("Files to upload:", files);
    console.log("Number of files:", files.length);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) {
        console.log(`Skipping file at index ${i} - file is null/undefined`);
        continue; // ✅ Changed from 'return' to 'continue'
      }

      console.log(`Processing file ${i + 1}/${files.length}:`, file.name);
      setFileName((prev) => [...prev, file.name]);

      try {
        const targetFolderId = selectedFolderId || (Folder?.[1] as string);
        console.log("Uploading to folder:", targetFolderId);

        await uploadFile(file, setProgress, targetFolderId);
        console.log(`Successfully uploaded: ${file.name}`);
      } catch (error) {
        console.error("Upload error:", error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    console.log("handleUploadFile completed");
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
    <aside className="flex h-screen w-64 flex-col bg-white">
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

      <nav className="flex-1 px-3 py-2">
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

      <div className="mx-6 border-t border-[#e8eaed]"></div>

      <div className="space-y-3 px-6 py-4">
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
