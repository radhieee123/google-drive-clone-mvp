// pages/drive/folders/[...Folder].tsx
import React from "react";
import { useRouter } from "next/router";
import GetFolders from "@/components/GetFolders";
import GetFiles from "@/components/GetFiles";
import Head from "next/head";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMockAuth } from "@/contexts/MockAuthContext"; // ← NEW!
import Login from "@/components/Login"; // ← NEW!
import { getFiles } from "@/lib/api-client"; // ← NEW!
import { DotLoader } from "react-spinners";

function Folder() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);

  const router = useRouter();
  const { Folder } = router.query;
  const { isAuthenticated, user, isLoading: authLoading } = useMockAuth(); // ← NEW!

  const folderId = Folder?.[1] || "";

  useEffect(() => {
    if (!authLoading && isAuthenticated && user && folderId) {
      loadFiles();
    }
  }, [isAuthenticated, user, authLoading, folderId]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      console.log("Loading files for folder:", folderId); // ← ADD THIS

      const data = await getFiles(folderId);
      console.log("Got data:", data); // ← ADD THIS

      setFiles(data.files || []);
      setFolders(data.folders || []);

      const hasFolders = (data.folders || []).length > 0;
      const hasFiles = (data.files || []).length > 0;

      setIsFolder(hasFolders);
      setIsFile(hasFiles);
    } catch (error) {
      console.error("Error loading files:", error); // This should already be there
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  if (authLoading) {
    // ← NEW!
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DotLoader color="#b8c2d7" size={60} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // ← NEW!
    return <Login />;
  }

  return (
    <>
      <Head>
        <title>Folder - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader headerName={"Nested Folder"} />
        <div className="h-[75vh] w-full overflow-y-auto p-5">
          {!isFile && !isFolder && isLoading ? (
            <div className="flex h-full items-center justify-center">
              <DotLoader color="#b8c2d7" size={60} />
            </div>
          ) : (
            <>
              {isFile || isFolder ? (
                <>
                  {isFolder && (
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Folders</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFolders folderId={folderId} select={""} />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Files</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFiles folderId={folderId} select={""} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <Image
                    draggable={false}
                    src="/empty_state_folder.png"
                    width={500}
                    height={500}
                    alt="empty-state"
                    className="w-full max-w-md object-cover object-center opacity-75"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Folder;
