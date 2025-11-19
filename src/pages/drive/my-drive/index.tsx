import Head from "next/head";
import GetFiles from "@/containers/DriveContent/GetFiles";
import GetFolders from "@/containers/DriveContent/GetFolders";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/components/Login";
import { getFiles } from "@/services/drive-service";
import { DotLoader } from "react-spinners";

interface FileItem {
  id: string;
  name: string;
  type?: string;
  size?: number;
  isTrashed?: boolean;
}

interface FolderItem {
  id: string;
  name: string;
  isTrashed?: boolean;
}

export default function Home() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const breadcrumbs = [
    {
      id: "root",
      name: "Home",
      path: "/",
    },
  ];

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFiles();

      const hasFolders = (data.folders || []).some(
        (item: FolderItem) => !item.isTrashed,
      );
      const hasFiles = (data.files || []).some(
        (item: FileItem) => !item.isTrashed,
      );

      setIsFolder(hasFolders);
      setIsFile(hasFiles);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      loadFiles();
    }
  }, [isAuthenticated, user, authLoading, loadFiles]);

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
        <title>My Drive - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader breadcrumbs={breadcrumbs} />
        <div className="h-[75vh] w-full overflow-y-auto bg-white p-5">
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
                        <GetFolders folderId="" select="" />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Files</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFiles folderId="" select="" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <h2 className="mb-5 text-xl font-medium text-textC">
                    A place for all of your files
                  </h2>
                  <Image
                    draggable={false}
                    src="/empty_state_drive.png"
                    width={500}
                    height={500}
                    alt="empty-state"
                    className="w-full max-w-2xl object-cover object-center"
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
