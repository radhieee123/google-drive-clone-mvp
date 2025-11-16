import React from "react";
import Link from "next/link";
import { Folder } from "lucide-react";

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-5 flex items-center gap-1 text-[16px]">
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <svg
              className="h-4 w-4 flex-shrink-0 text-[#5f6368]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {index === items.length - 1 ? (
            <div className="flex items-center gap-2 px-1 py-1">
              {index === 0 && item.name === "Home" && (
                <Folder
                  className="h-5 w-5 text-[#5f6368]"
                  fill="currentColor"
                />
              )}
              <span className="font-normal text-[#202124]">{item.name}</span>
            </div>
          ) : (
            <Link
              href={item.path}
              className="flex items-center gap-2 rounded px-1 py-1 font-normal text-[#5f6368] transition-all duration-150 hover:bg-[#f1f3f4]"
            >
              {index === 0 && item.name === "Home" && (
                <Folder className="h-5 w-5" fill="currentColor" />
              )}
              <span>{item.name}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
