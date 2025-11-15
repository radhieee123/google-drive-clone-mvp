import React, { ReactNode } from "react";
import Header from "./headerComponents/Header";
import SideMenu from "./SideMenu";
import { useMockAuth } from "@/contexts/MockAuthContext";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useMockAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SideMenu />

        <main className="flex-1 overflow-auto bg-bgc">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
