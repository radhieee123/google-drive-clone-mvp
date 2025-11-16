"use client";
import React, { useRef, useEffect } from "react";
import {
  BsFolder2,
  BsFileEarmarkArrowUp,
  BsFolderPlus,
  BsFileEarmarkPlus,
} from "react-icons/bs";
import { AiOutlineFile, AiOutlineUpload } from "react-icons/ai";
import {
  HiOutlineDocumentText,
  HiOutlineTable,
  HiOutlinePresentationChartBar,
} from "react-icons/hi";
import { MdOutlineUploadFile } from "react-icons/md";

interface DropDownProps {
  setFolderToggle: (value: boolean) => void;
  uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsDropDown: (value: boolean) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  dividerAfter?: boolean;
}

function DropDown({
  setFolderToggle,
  uploadFile,
  setIsDropDown,
}: DropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsDropDown]);

  const handleNewFolder = () => {
    setFolderToggle(true);
    setIsDropDown(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFolderUpload = () => {
    folderInputRef.current?.click();
  };

  const menuItems: MenuItem[] = [
    {
      icon: <BsFolderPlus className="h-5 w-5" />,
      label: "New folder",
      action: handleNewFolder,
      dividerAfter: true,
    },
    {
      icon: <MdOutlineUploadFile className="h-5 w-5" />,
      label: "File upload",
      action: handleFileUpload,
    },
    {
      icon: <BsFolder2 className="h-5 w-5" />,
      label: "Folder upload",
      action: handleFolderUpload,
      dividerAfter: true,
    },
    {
      icon: <HiOutlineDocumentText className="h-5 w-5" />,
      label: "Google Docs",
      action: () => console.log("Create Google Doc"),
    },
    {
      icon: <HiOutlineTable className="h-5 w-5" />,
      label: "Google Sheets",
      action: () => console.log("Create Google Sheet"),
    },
    {
      icon: <HiOutlinePresentationChartBar className="h-5 w-5" />,
      label: "Google Slides",
      action: () => console.log("Create Google Slides"),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsDropDown(false)}
      ></div>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className="animate-in fade-in slide-in-from-top-2 absolute left-3 top-20 z-50 w-72
        rounded-lg
        bg-white py-2 shadow-[0_2px_6px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.3)] duration-200"
      >
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={item.action}
              className="flex w-full items-center gap-4 px-6 py-3 text-left
              text-[#202124] transition-colors duration-150 hover:bg-[#f1f3f4]"
            >
              <div className="flex items-center justify-center text-[#5f6368]">
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </button>
            {item.dividerAfter && (
              <div className="mx-4 my-2 border-t border-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => {
          uploadFile(e);
          setIsDropDown(false);
        }}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore - webkitdirectory is not in the types
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={(e) => {
          uploadFile(e);
          setIsDropDown(false);
        }}
        className="hidden"
      />
    </>
  );
}

export default DropDown;
