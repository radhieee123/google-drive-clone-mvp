import Head from "next/head";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/components/Login";
import { getFiles } from "@/lib/api-client";
import { DotLoader } from "react-spinners";

export default function Trash() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      loadTrashedFiles();
    }
  }, [isAuthenticated, user, authLoading]);

  const loadTrashedFiles = async () => {
    try {
      setIsLoading(true);
      const data = await getFiles(undefined, false, true);

      const hasFolders = (data.folders || []).length > 0;
      const hasFiles = (data.files || []).length > 0;

      setIsFolder(hasFolders);
      setIsFile(hasFiles);
    } catch (error) {
      console.error("Error loading trashed files:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DotLoader color="#b8c2d7" size={60} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Head>
        <title>Trash - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader headerName={"Trash"} />
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
                        <GetFolders folderId="" select="trashed" />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Files</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFiles folderId="" select="trashed" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <h2 className="mb-5 text-xl font-medium text-textC">
                    Trash is empty
                  </h2>
                  <Image
                    draggable={false}
                    src="/empty_state_drive.png"
                    width={500}
                    height={500}
                    alt="empty-state"
                    className="w-full max-w-2xl object-cover object-center opacity-50"
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
