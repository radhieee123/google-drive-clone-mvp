import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { DiGoogleDrive } from "react-icons/di";
import { MdStarBorder } from "react-icons/md";
import { RiDeleteBin6Fill, RiDeleteBin6Line } from "react-icons/ri";
import { IoMdStar } from "react-icons/io";

function Navbar() {
  const router = useRouter();

  const isActive = (href: string) => router.pathname === href;
  return (
    <nav className="space-y-0.5 pr-5">
      <Link
        href={"/drive/my-drive"}
        className={`flex items-center justify-center rounded-full p-2 hover:bg-darkC tablet:justify-normal tablet:space-x-3 tablet:px-4 tablet:py-1.5 ${
          isActive("/drive/my-drive") ? "bg-[#C2E7FF]" : ""
        }`}
      >
        {isActive("/drive/my-drive") ? (
          <DiGoogleDrive className="h-6 w-6 rounded-sm border-[2.3px] border-textC bg-textC text-white tablet:h-5 tablet:w-5" />
        ) : (
          <DiGoogleDrive className="h-6 w-6 rounded-sm border-[2.3px] border-textC tablet:h-5 tablet:w-5" />
        )}
        <span className="hidden tablet:block">My Drive</span>
      </Link>
      <Link
        href={"/drive/starred"}
        className={`flex items-center justify-center rounded-full p-2 hover:bg-darkC tablet:justify-normal tablet:space-x-3 tablet:px-4 tablet:py-1.5 ${
          isActive("/drive/starred") ? "bg-[#C2E7FF]" : ""
        }`}
      >
        {isActive("/drive/starred") ? (
          <IoMdStar className="h-6 w-6 tablet:h-5 tablet:w-5" />
        ) : (
          <MdStarBorder className="h-6 w-6 tablet:h-5 tablet:w-5" />
        )}

        <span className="hidden tablet:block">Starred</span>
      </Link>
      <Link
        href={"/drive/trash"}
        className={`flex items-center justify-center rounded-full p-2 hover:bg-darkC tablet:justify-normal tablet:space-x-3 tablet:px-4 tablet:py-1.5 ${
          isActive("/drive/trash") ? "bg-[#C2E7FF]" : ""
        }`}
      >
        {isActive("/drive/trash") ? (
          <RiDeleteBin6Fill className="h-6 w-6 tablet:h-5 tablet:w-5" />
        ) : (
          <RiDeleteBin6Line className="h-6 w-6 tablet:h-5 tablet:w-5" />
        )}
        <span className="hidden tablet:block">Bin</span>
      </Link>
    </nav>
  );
}

export default Navbar;
