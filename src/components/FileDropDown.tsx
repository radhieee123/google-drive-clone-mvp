import React from "react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MdDriveFileRenameOutline,
  MdOutlineRestore,
  MdStarBorder,
  MdStarRate,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbDownload } from "react-icons/tb";
import {
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder,
  starFile,
  starFolder,
  trashFile,
  trashFolder,
} from "@/lib/api-client";
import { useRouter } from "next/router";

function FileDropDown({
  file,
  setOpenMenu,
  select,
  isFolderComp,
  folderId,
  setRenameToggle,
}: FileDropDownProps) {
  const router = useRouter();

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const handleStar = async () => {
    try {
      if (isFolderComp) {
        await starFolder(file.id, !file.isStarred);
      } else {
        await starFile(file.id, !file.isStarred);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error starring:", error);
      alert("Failed to star item");
    }
  };

  const handleTrash = async () => {
    try {
      if (isFolderComp) {
        await trashFolder(file.id, true);
      } else {
        await trashFile(file.id, true);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error trashing:", error);
      alert("Failed to move to trash");
    }
  };

  const handleRestore = async () => {
    try {
      if (isFolderComp) {
        await trashFolder(file.id, false);
      } else {
        await trashFile(file.id, false);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error restoring:", error);
      alert("Failed to restore item");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete this ${
        isFolderComp ? "folder" : "file"
      }?`,
    );

    if (!confirmed) return;

    try {
      if (isFolderComp) {
        await deleteFolder(file.id);
      } else {
        await deleteFile(file.id);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete item");
    }
  };

  return (
    <section
      onClick={() => setOpenMenu("")}
      className={`absolute top-9 z-10 ${
        select == "trashed" ? "h-fit" : "h-40"
      } w-48 overflow-y-scroll rounded-md border bg-white shadow-sm shadow-[#777]`}
    >
      {select !== "trashed" ? (
        <>
          <div
            onClick={() =>
              isFolderComp
                ? router.push("/drive/folders/" + folderId)
                : openFile(file.fileLink)
            }
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <HiOutlineArrowsExpand className="h-5 w-5" />
            <span className="text-sm">
              Open {isFolderComp ? "Folder" : "File"}
            </span>
          </div>
          {!isFolderComp && (
            <a
              href={file.fileLink}
              download={file.fileName}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <TbDownload className="h-5 w-5" />
              <span className="text-sm">Download</span>
            </a>
          )}

          <div
            onClick={() => setRenameToggle(file.id)}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <MdDriveFileRenameOutline className="h-5 w-5" />
            <span className="text-sm">Rename</span>
          </div>
          <div
            onClick={handleStar}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            {!file.isStarred ? (
              <MdStarBorder className="h-5 w-5" />
            ) : (
              <MdStarRate className="h-5 w-5" />
            )}
            <span className="text-sm">
              {file.isStarred ? "Remove from starred" : "Add to starred"}
            </span>
          </div>
          <div
            onClick={handleTrash}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <RiDeleteBin6Line className="h-5 w-5" />
            <span className="text-sm">Move to bin</span>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={handleRestore}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <MdOutlineRestore className="h-5 w-5" />
            <span className="text-sm">Restore</span>
          </div>
          <div
            onClick={handleDelete}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <RiDeleteBin6Line className="h-5 w-5" />
            <span className="text-sm">Delete forever</span>
          </div>
        </>
      )}
    </section>
  );
}

export default FileDropDown;
