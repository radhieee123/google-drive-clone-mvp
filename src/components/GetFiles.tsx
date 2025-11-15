import React, { useState, useEffect } from "react";
import Image from "next/image";
import fileIcons from "@/components/fileIcons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useMockAuth } from "@/contexts/MockAuthContext";
import FileDropDown from "./FileDropDown";
import { getFiles } from "@/lib/api-client";
import Rename from "./Rename";

function GetFiles({ folderId, select }: { folderId: string; select: string }) {
  const [openMenu, setOpenMenu] = useState("");
  const [renameToggle, setRenameToggle] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);

  const { user } = useMockAuth();

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [folderId, select, user]);

  const loadFiles = async () => {
    try {
      const starred = select === "starred";
      const trashed = select === "trashed";

      const data = await getFiles(folderId || undefined, starred, trashed);
      setFileList(data.files || []);
    } catch (error) {
      console.error("Error loading files:", error);
      setFileList([]);
    }
  };

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const handleMenuToggle = (fileId: string) => {
    setRenameToggle("");
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === fileId ? "" : fileId));
  };

  const list = fileList.map((file) => {
    const icon =
      fileIcons[file.fileExtension as keyof typeof fileIcons] ??
      fileIcons["any"];

    const img = ["jpg", "ico", "webp", "png", "jpeg", "gif", "jfif"].includes(
      file.fileExtension,
    ) ? (
      <Image
        src={file.fileLink}
        alt={file.fileName}
        height="500"
        width="500"
        draggable={false}
        className="h-full w-full rounded-sm object-cover object-center"
      />
    ) : file.fileExtension === "mp3" ? (
      <div className="flex flex-col items-center justify-center">
        <div className="h-24 w-24 ">{icon}</div>
        <audio controls className="w-44">
          <source src={file.fileLink} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    ) : file.fileExtension === "mp4" ? (
      <video controls>
        <source src={file.fileLink} type="audio/mpeg" />
        <div className="h-36 w-36 ">{icon}</div>
      </video>
    ) : (
      <div className="h-36 w-36 ">{icon}</div>
    );

    let condition = !file?.isTrashed;
    if (select === "starred") condition = file?.isStarred && !file?.isTrashed;
    else if (select === "trashed") condition = file?.isTrashed;

    return (
      condition && (
        <div
          key={file.id}
          onDoubleClick={() => openFile(file.fileLink)}
          className="hover:cursor-alias"
        >
          <div
            className="flex w-full flex-col items-center justify-center
         overflow-hidden rounded-xl bg-darkC2 px-2.5 hover:bg-darkC"
          >
            <div className="relative flex w-full items-center justify-between px-1 py-3">
              <div className="flex items-center space-x-4">
                <div className="h-6 w-6">{icon}</div>
                <span className="w-32 truncate text-sm font-medium text-textC">
                  {file.fileName}
                </span>
              </div>
              <BsThreeDotsVertical
                onClick={() => handleMenuToggle(file.id)}
                className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-[#ccc]"
              />
              {openMenu === file.id && (
                <FileDropDown
                  file={file}
                  setOpenMenu={setOpenMenu}
                  isFolderComp={false}
                  select={select}
                  folderId=""
                  setRenameToggle={setRenameToggle}
                />
              )}
              {renameToggle === file.id && (
                <Rename
                  setRenameToggle={setRenameToggle}
                  fileId={file.id}
                  isFolder={false}
                  fileName={file.fileName}
                  fileExtension={file.fileExtension}
                />
              )}
            </div>
            <div className="flex h-44 w-48 items-center justify-center pb-2.5">
              {img}
            </div>
          </div>
        </div>
      )
    );
  });

  return <>{list}</>;
}

export default GetFiles;
