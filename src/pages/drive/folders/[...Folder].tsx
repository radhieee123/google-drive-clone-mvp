import React from "react";
import { useRouter } from "next/router";
import GetFolders from "@/containers/DriveContent/GetFolders";
import GetFiles from "@/containers/DriveContent/GetFiles";
import Head from "next/head";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/components/Login";
import {
  getFiles,
  getFolderById,
  getFolderPath,
} from "@/services/drive-service";
import { DotLoader } from "react-spinners";
import { logCustom } from "@/utils/logger";
import { useComponentTracking } from "@/hooks/useComponentTracking";

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

function Folder() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [currentFolderName, setCurrentFolderName] = useState("Nested Folder");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const router = useRouter();
  const { Folder } = router.query;
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const folderId = Folder?.[0] || "";

  useComponentTracking("FolderPage");

  useEffect(() => {
    if (folderId && currentFolderName) {
      logCustom(`User viewing folder: ${currentFolderName}`, "FOLDER_VIEW", {
        folderId,
        folderName: currentFolderName,
        hasFiles: isFile,
        hasFolders: isFolder,
        fileCount: files.length,
        folderCount: folders.length,
      });
    }
  }, [
    folderId,
    currentFolderName,
    isFile,
    isFolder,
    files.length,
    folders.length,
  ]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user && folderId) {
      loadFiles();
      loadBreadcrumbs();
    }
  }, [isAuthenticated, user, authLoading, folderId]);

  const loadBreadcrumbs = async () => {
    try {
      const pathData = await getFolderPath(folderId);

      // Build breadcrumbs starting with Home
      const breadcrumbItems: BreadcrumbItem[] = [
        {
          id: "root",
          name: "Home",
          path: "/",
        },
      ];

      // Add each folder in the path
      pathData.path.forEach((folder: any) => {
        breadcrumbItems.push({
          id: folder.id,
          name: folder.name,
          path: `/Folder/${folder.id}`,
        });
      });

      setBreadcrumbs(breadcrumbItems);
    } catch (error) {
      console.error("Error loading breadcrumbs:", error);
      // Fallback breadcrumbs
      setBreadcrumbs([
        {
          id: "root",
          name: "Home",
          path: "/",
        },
        {
          id: folderId,
          name: currentFolderName,
          path: `/Folder/${folderId}`,
        },
      ]);
    }
  };

  const loadFiles = async () => {
    try {
      setIsLoading(true);

      logCustom(`Loading folder contents: ${folderId}`, "FOLDER_LOAD_START", {
        folderId,
      });

      const data = await getFiles(folderId);
      const folderData = await getFolderById(folderId);

      setFiles(data.files || []);
      setFolders(data.folders || []);

      if (folderData?.folderName) {
        setCurrentFolderName(folderData.folderName);
      }

      const hasFolders = (data.folders || []).length > 0;
      const hasFiles = (data.files || []).length > 0;

      setIsFolder(hasFolders);
      setIsFile(hasFiles);

      logCustom(
        `Folder loaded successfully: ${folderData?.folderName || folderId}`,
        "FOLDER_LOAD_SUCCESS",
        {
          folderId,
          folderName: folderData?.folderName,
          fileCount: (data.files || []).length,
          folderCount: (data.folders || []).length,
        },
      );
    } catch (error) {
      console.error("Error loading files:", error);

      logCustom(`Failed to load folder: ${folderId}`, "FOLDER_LOAD_ERROR", {
        folderId,
        error: String(error),
      });
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
        <title>{currentFolderName} - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader breadcrumbs={breadcrumbs} />
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
