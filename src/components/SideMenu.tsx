"use client";
import React, { useState, ChangeEvent } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import DropDown from "./addBtnComponents/DropDown";
import AddFolder from "./addBtnComponents/AddFolder";
import Navbar from "./Navbar";
import { uploadFile } from "../lib/fileUpload";
import ProgressIndicator from "./ProgressIndicator";
import { addFolder } from "@/lib/api-client";
import { useMockAuth } from "@/contexts/MockAuthContext";
import { useRouter } from "next/router";

function SideMenu() {
  const [isDropDown, setIsDropDown] = useState(false);
  const [progress, setProgress] = useState([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const [folderName, setFolderName] = useState<string>("");
  const [folderToggle, setFolderToggle] = useState(false);

  const router = useRouter();
  const { Folder } = router.query;
  const { user } = useMockAuth();

  const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    for (let i = 0; i < files.length; i++) {
      const file = files?.[i];
      if (!file) return;

      setFileName((prev) => [...prev, file.name]);

      try {
        await uploadFile(file, setProgress, Folder?.[1] as string);
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
  const displayProgress = [...progress].reverse();

  return (
    <section className="relative h-[90vh] w-16 space-y-4 duration-500 tablet:w-60">
      <button
        onClick={() => setIsDropDown(true)}
        className="mt-1 flex w-fit items-center justify-center space-x-2
      rounded-2xl bg-white p-3 text-textC shadow-md shadow-[#ddd]
      duration-300 hover:bg-darkC2 hover:shadow-[#bbb] tablet:px-5 tablet:py-4"
      >
        <HiOutlinePlusSm className="h-6 w-6" />
        <span className="hidden text-sm font-medium tablet:block">New</span>
      </button>
      {isDropDown && (
        <DropDown
          setFolderToggle={setFolderToggle}
          uploadFile={handleUploadFile}
          setIsDropDown={setIsDropDown}
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
      <Navbar />
    </section>
  );
}

export default SideMenu;
