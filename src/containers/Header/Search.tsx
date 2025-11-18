import { useAuth } from "@/hooks/useAuth";
import React, { useState, useEffect, useRef } from "react";
import { AiFillFolder, AiOutlineSearch } from "react-icons/ai";
import FileIcons from "../../components/FileIcons";
import { useRouter } from "next/router";
import { getFiles } from "@/services/drive-service";

function Search() {
  const [searchText, setSearchText] = useState<string>("");
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const [allFolders, setAllFolders] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadAllItems();
    }
  }, [user]);

  const loadAllItems = async () => {
    try {
      const data = await getFiles();
      setAllFiles(data.files || []);
      setAllFolders(data.folders || []);
    } catch (error) {
      console.error("Error loading files for search:", error);
    }
  };

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const searchResults = [
    ...allFiles.filter(
      (item) =>
        item.fileName?.toLowerCase().includes(searchText.toLowerCase()) &&
        searchText &&
        !item.isTrashed,
    ),
    ...allFolders.filter(
      (item) =>
        item.folderName?.toLowerCase().includes(searchText.toLowerCase()) &&
        searchText &&
        !item.isTrashed,
    ),
  ];

  const result = searchResults.map((item) => {
    const isFolder = item.folderName !== undefined;
    const icon = isFolder
      ? null
      : FileIcons[item.fileExtension as keyof typeof FileIcons] ??
        FileIcons["any"];

    return (
      <div
        key={item.id}
        onClick={() => {
          isFolder
            ? router.push("/drive/folders/" + item.id)
            : openFile(item.fileLink);
          setOnFocus(false);
          setSearchText("");
        }}
        className="flex w-full cursor-pointer items-center space-x-3.5 border-blue-700 px-4 py-2 hover:border-l-2 hover:bg-darkC2"
      >
        <span className="h-6 w-6">
          {isFolder ? (
            <AiFillFolder className="h-full w-full text-textC" />
          ) : (
            icon
          )}
        </span>
        <span className="w-full truncate">
          {item.fileName || item.folderName}
        </span>
      </div>
    );
  });

  const handleDocumentClick = (e: { target: any }) => {
    if (
      inputRef.current &&
      e.target &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setOnFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative flex-1" onFocus={() => setOnFocus(true)}>
      <span className="absolute left-2 top-[5px] h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC">
        <AiOutlineSearch className="h-full w-full stroke-textC" stroke="2" />
      </span>

      <input
        ref={inputRef}
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        type="text"
        placeholder="Search in Drive"
        className="w-full rounded-full bg-darkC2 px-2 py-[11px] indent-11 shadow-darkC
        placeholder:text-textC focus:rounded-b-none
        focus:rounded-t-2xl focus:bg-white focus:shadow-md focus:outline-none"
      />
      {onFocus && (
        <div
          className="absolute z-10 max-h-60 w-full overflow-scroll rounded-b-2xl border-t-[1.5px]
      border-textC bg-white pt-2 shadow-md shadow-darkC"
        >
          {result.length < 1 && searchText ? (
            <div className="pl-5 text-sm text-gray-500">
              No result match your search.
            </div>
          ) : (
            result
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
