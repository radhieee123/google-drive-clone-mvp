"use client";
import React, { useRef, useEffect, useState } from "react";
import { BsFolder2, BsFolderPlus } from "react-icons/bs";
import {
  HiOutlineDocumentText,
  HiOutlineTable,
  HiOutlinePresentationChartBar,
} from "react-icons/hi";
import { MdOutlineUploadFile } from "react-icons/md";

interface DropDownProps {
  setFolderToggle: (value: boolean) => void;
  uploadFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    folderId?: string,
  ) => void;
  setIsDropDown: (value: boolean) => void;
  folders?: Array<{ id: string; name: string }>;
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
  folders = [],
}: DropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

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

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPendingFiles(e.target.files);
      setShowFolderSelector(true);
    }
  };

  const handleFolderChoice = (folderId?: string) => {
    if (pendingFiles) {
      const syntheticEvent = {
        target: {
          files: pendingFiles,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      uploadFile(syntheticEvent, folderId);
      setPendingFiles(null);
      setShowFolderSelector(false);
      setIsDropDown(false);

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCancelFolderSelection = () => {
    setShowFolderSelector(false);
    setPendingFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      {showFolderSelector && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-[#202124]">
              Choose destination folder
            </h3>

            <p className="mb-4 text-sm text-[#5f6368]">
              {pendingFiles?.length} file(s) selected
            </p>

            <div className="max-h-64 space-y-1 overflow-y-auto rounded border border-gray-200 p-2">
              <button
                onClick={() => handleFolderChoice(undefined)}
                className="w-full rounded px-4 py-2 text-left transition-colors hover:bg-[#f1f3f4]"
              >
                <div className="flex items-center gap-3">
                  <BsFolder2 className="h-5 w-5 text-[#5f6368]" />
                  <span className="text-sm font-medium">My Drive (Root)</span>
                </div>
              </button>

              {folders.length > 0 ? (
                folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleFolderChoice(folder.id)}
                    className="w-full rounded px-4 py-2 text-left transition-colors hover:bg-[#f1f3f4]"
                  >
                    <div className="flex items-center gap-3">
                      <BsFolder2 className="h-5 w-5 text-[#5f6368]" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-sm text-[#5f6368]">
                  No folders available
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCancelFolderSelection}
                className="rounded px-4 py-2 text-sm text-[#5f6368] hover:bg-[#f1f3f4]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelected}
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
          uploadFile(e, undefined);
          setIsDropDown(false);
        }}
        className="hidden"
      />
    </>
  );
}

export default DropDown;
