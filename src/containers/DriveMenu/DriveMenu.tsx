"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import DropDown from "./DropDown";
import AddFolder from "./AddFolder";
import { uploadFile } from "../../services/file-upload-service";
import ProgressIndicator from "../../components/ProgressIndicator";
import { addFolder } from "@/services/drive-service";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import {
  MyDriveIcon,
  SharedIcon,
  RecentIcon,
  StarredIcon,
  TrashIcon,
  StorageIcon,
} from "../../components/FileIcons";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface Folder {
  id: string;
  folderName: string;
}

type ProgressUpdate = Array<Record<string, number>>;

function DriveMenu() {
  const [isDropDown, setIsDropDown] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate>([]);
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
      icon: <MyDriveIcon />,
      label: "My Drive",
      path: "/drive/my-drive",
    },
    {
      icon: <SharedIcon />,
      label: "Shared with me",
      path: "/shared",
    },
    {
      icon: <RecentIcon />,
      label: "Recent",
      path: "/recent",
    },
    {
      icon: <StarredIcon />,
      label: "Starred",
      path: "/drive/starred",
    },
    {
      icon: <TrashIcon />,
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
  const displayProgress = displayFileNames.map((name) => {
    const progressEntry = [...progress]
      .reverse()
      .find((entry) => entry[name] !== undefined);
    return progressEntry?.[name] ?? 0;
  });

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
          <StorageIcon className="h-5 w-5 text-[#5f6368]" />
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

export default DriveMenu;
