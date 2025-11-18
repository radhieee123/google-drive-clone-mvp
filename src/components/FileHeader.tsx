import React from "react";
import Breadcrumb from "./Breadcrumb";
import { AiFillCaretDown } from "react-icons/ai";
import { FileHeaderType } from "../types/fileHeader";
import { FILE_HEADER } from "../constants";

export default function FileHeader({
  headerName,
  breadcrumbs,
}: FileHeaderType) {
  return (
    <div className=" mb-5 bg-white px-5 py-3">
      {breadcrumbs ? (
        <Breadcrumb items={breadcrumbs} />
      ) : (
        <h1 className="text-[15px] font-normal text-[#202124]">{headerName}</h1>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>{FILE_HEADER.TYPE}</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>{FILE_HEADER.PEOPLE}</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>{FILE_HEADER.MODIFIED}</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
