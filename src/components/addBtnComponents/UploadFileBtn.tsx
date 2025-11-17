import React, { useState, useRef } from "react";
import { MdUploadFile } from "react-icons/md";
import { BsFolder2, BsChevronDown } from "react-icons/bs";

interface UploadFileBtnProps {
  uploadFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    folderId?: string,
  ) => void;
  folders?: Array<{ id: string; name: string }>;
}

function UploadFileBtn({ uploadFile, folders = [] }: UploadFileBtnProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(
    undefined,
  );
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFile(e, selectedFolder);
  };

  const selectedFolderName =
    folders.find((f) => f.id === selectedFolder)?.name || "Root";

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-1 items-center space-x-3 px-4 py-1.5 hover:bg-darkC"
        >
          <MdUploadFile className="h-5 w-5" />
          <span>File upload</span>
        </button>

        <button
          onClick={() => setShowFolderDropdown(!showFolderDropdown)}
          className="flex items-center gap-1 px-3 py-1.5 hover:bg-darkC"
        >
          <BsFolder2 className="h-4 w-4" />
          <span className="text-xs">{selectedFolderName}</span>
          <BsChevronDown className="h-3 w-3" />
        </button>
      </div>

      {showFolderDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFolderDropdown(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setSelectedFolder(undefined);
                setShowFolderDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Root (My Drive)
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setShowFolderDropdown(false);
                }}
                onMouseEnter={() => console.log("Mouse entered Root button")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                {folder.name}
              </button>
            ))}
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default UploadFileBtn;
