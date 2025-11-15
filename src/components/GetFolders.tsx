// src/components/GetFolders.tsx
import React, { useState, useEffect } from "react";
import { AiFillFolder } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useMockAuth } from "@/contexts/MockAuthContext";
import { getFiles } from "@/lib/api-client";
import FileDropDown from "./FileDropDown";
import Rename from "./Rename";

function GetFolders({
  folderId,
  select,
}: {
  folderId: string;
  select: string;
}) {
  const [openMenu, setOpenMenu] = useState("");
  const [renameToggle, setRenameToggle] = useState("");
  const [folderList, setFolderList] = useState<any[]>([]);

  const { user } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadFolders();
    }
  }, [folderId, select, user]);

  const loadFolders = async () => {
    try {
      const starred = select === "starred";
      const trashed = select === "trashed";

      const data = await getFiles(folderId || undefined, starred, trashed);
      setFolderList(data.folders || []);
    } catch (error) {
      console.error("Error loading folders:", error);
      setFolderList([]);
    }
  };

  const handleMenuToggle = (fileId: string) => {
    // Toggle the dropdown for the given file
    setRenameToggle("");
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === fileId ? "" : fileId));
  };

  const folders = folderList.map((folder) => {
    // set a condition for the folders to be displayed
    let condition = !folder?.isTrashed;
    if (select === "starred")
      condition = folder?.isStarred && !folder?.isTrashed;
    else if (select === "trashed") condition = folder?.isTrashed;

    return (
      condition && (
        <div
          key={folder.id}
          onDoubleClick={() => {
            select !== "trashed" && router.push("/drive/folders/" + folder.id);
          }}
          className="relative flex w-[13.75rem] cursor-alias items-center justify-between rounded-xl bg-darkC2 p-3 hover:bg-darkC"
        >
          <div className="flex items-center space-x-2">
            <AiFillFolder className="h-6 w-6" />
            <span className="w-32 truncate text-sm font-medium text-textC">
              {folder.folderName}
            </span>
          </div>
          <BsThreeDotsVertical
            onClick={() => handleMenuToggle(folder.id)}
            className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-[#ccc]"
          />
          {
            /* drop down */
            openMenu === folder.id && (
              <FileDropDown
                file={folder}
                setOpenMenu={setOpenMenu}
                isFolderComp={true}
                select={select}
                folderId={folder.id}
                setRenameToggle={setRenameToggle}
              />
            )
          }
          {
            // rename toggle
            renameToggle === folder.id && (
              <Rename
                setRenameToggle={setRenameToggle}
                fileId={folder.id}
                fileName={folder.folderName}
                isFolder={true}
                fileExtension=""
              />
            )
          }
        </div>
      )
    );
  });

  return <>{folders}</>;
}

export default GetFolders;
