// src/components/Rename.tsx
import { renameFile, renameFolder } from "@/lib/api-client";
import React, { useState } from "react";

// The Rename component displays a pop-up for rename input.
function Rename({
  setRenameToggle,
  fileId,
  fileName,
  isFolder,
  fileExtension,
}: renameProps) {
  const [newName, setNewName] = useState(fileName);
  const [isLoading, setIsLoading] = useState(false);

  const rename = async () => {
    // Check if the file name is empty
    if (newName === "") return;

    setIsLoading(true);

    try {
      if (isFolder) {
        await renameFolder(fileId, newName);
      } else {
        const formatName = newName.includes(".")
          ? newName
          : newName + "." + fileExtension;
        await renameFile(fileId, formatName);
      }

      setRenameToggle("");
      window.location.reload(); // Reload to see changes
    } catch (error) {
      console.error("Error renaming:", error);
      alert("Failed to rename");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-9 z-10 space-y-2 rounded-xl bg-white p-3 shadow-lg shadow-[#bbb]">
      <h2 className="text-xl">Rename</h2>
      <input
        className="w-full rounded-md border border-textC py-1.5 indent-2 outline-textC2"
        type="text"
        placeholder="Rename"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        disabled={isLoading}
      />
      <div className=" flex w-full justify-between  font-medium text-textC2">
        <button
          type="button"
          onClick={() => setRenameToggle("")}
          className="rounded-full px-3 py-2 hover:bg-darkC2"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={() => rename()}
          className={`rounded-full px-3 py-2 ${
            newName && !isLoading && "hover:bg-darkC2"
          }`}
          disabled={isLoading || !newName}
        >
          {isLoading ? "Renaming..." : "Rename"}
        </button>
      </div>
    </div>
  );
}

export default Rename;
