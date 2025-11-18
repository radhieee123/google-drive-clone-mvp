import React, { ReactNode } from "react";
import Header from "../containers/Header";
import { DriveMenu } from "../containers/DriveMenu";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <DriveMenu />

        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
