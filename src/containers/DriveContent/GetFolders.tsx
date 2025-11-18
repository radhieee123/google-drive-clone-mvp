import React, { useState, useEffect } from "react";
import { AiFillFolder } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { getFiles } from "@/services/drive-service";
import FileDropDown from "../../components/FileDropDown";
import Rename from "../../components/Rename";
import { logClick } from "@/utils/logger";

interface GetFoldersProps {
  folderId: string;
  select: string;
}

function GetFolders({ folderId, select }: GetFoldersProps) {
  const [openMenu, setOpenMenu] = useState("");
  const [renameToggle, setRenameToggle] = useState("");
  const [folderList, setFolderList] = useState<any[]>([]);

  const { user } = useAuth();
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

  const handleMenuToggle = (
    folderId: string,
    folderName: string,
    e: React.MouseEvent,
  ) => {
    logClick(
      `Toggle menu for folder: ${folderName}`,
      `folder-menu-toggle-${folderId}`,
      { x: e.clientX, y: e.clientY },
    );
    setRenameToggle("");
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === folderId ? "" : folderId));
  };

  const handleFolderOpen = (folderId: string, folderName: string) => {
    logClick(`Open folder: ${folderName}`, `folder-open-${folderId}`);
    router.push("/drive/folders/" + folderId);
  };

  const folders = folderList.map((folder) => {
    let condition = !folder?.isTrashed;
    if (select === "starred")
      condition = folder?.isStarred && !folder?.isTrashed;
    else if (select === "trashed") condition = folder?.isTrashed;

    return (
      condition && (
        <div
          key={folder.id}
          onDoubleClick={() => {
            select !== "trashed" &&
              handleFolderOpen(folder.id, folder.folderName);
          }}
          className="relative flex w-[13.75rem] cursor-pointer items-center justify-between rounded-xl bg-darkC2 p-3 transition-all duration-150 ease-in-out hover:scale-[1.02] hover:bg-darkC hover:shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <AiFillFolder className="h-6 w-6" />
            <span className="w-32 truncate text-sm font-medium text-textC">
              {folder.folderName}
            </span>
          </div>
          <BsThreeDotsVertical
            onClick={(e) => handleMenuToggle(folder.id, folder.folderName, e)}
            className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-[#ccc]"
          />
          {openMenu === folder.id && (
            <FileDropDown
              file={folder}
              setOpenMenu={setOpenMenu}
              isFolderComp={true}
              select={select}
              folderId={folder.id}
              setRenameToggle={setRenameToggle}
            />
          )}
          {renameToggle === folder.id && (
            <Rename
              setRenameToggle={setRenameToggle}
              fileId={folder.id}
              fileName={folder.folderName}
              isFolder={true}
              fileExtension=""
            />
          )}
        </div>
      )
    );
  });

  return <>{folders}</>;
}

export default GetFolders;
