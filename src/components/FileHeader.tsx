import React from "react";
import Breadcrumb from "./Breadcrumb";
import { AiFillCaretDown } from "react-icons/ai";

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface FileHeaderProps {
  headerName?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function FileHeader({
  headerName,
  breadcrumbs,
}: FileHeaderProps) {
  return (
    <div className=" mb-5 bg-white px-5 py-3">
      {breadcrumbs ? (
        <Breadcrumb items={breadcrumbs} />
      ) : (
        <h1 className="text-[15px] font-normal text-[#202124]">{headerName}</h1>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>Type</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>People</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>Modified</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
