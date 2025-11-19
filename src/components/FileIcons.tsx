import { AiFillFile, AiFillFileZip } from "react-icons/ai";
import { MdMovie, MdPictureAsPdf } from "react-icons/md";
import { IoMdHeadset } from "react-icons/io";
import {
  BiSolidImageAlt,
  BiSolidFileTxt,
  BiSolidFileDoc,
} from "react-icons/bi";

interface FileIcons {
  [key: string]: React.ReactNode;
}

export const MyDriveIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    focusable="false"
  >
    <path d="M9.05 15H15q.275 0 .5-.137.225-.138.35-.363l1.1-1.9q.125-.225.1-.5-.025-.275-.15-.5l-2.95-5.1q-.125-.225-.35-.363Q13.375 6 13.1 6h-2.2q-.275 0-.5.137-.225.138-.35.363L7.1 11.6q-.125.225-.125.5t.125.5l1.05 1.9q.125.25.375.375T9.05 15Zm1.2-3L12 9l1.75 3ZM3 17V4q0-.825.587-1.413Q4.175 2 5 2h14q.825 0 1.413.587Q21 3.175 21 4v13Zm2 5q-.825 0-1.413-.587Q3 20.825 3 20v-1h18v1q0 .825-.587 1.413Q19.825 22 19 22Z" />
  </svg>
);

export const SharedIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg className={className} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
  </svg>
);

export const RecentIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg className={className} viewBox="0 -960 960 960" fill="currentColor">
    <path d="m614-310 51-51-149-149v-210h-72v240l170 170ZM480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-630q30-70 82.5-122t122.46-82q69.96-30 149.5-30t149.55 30.24q70 30.24 121.79 82.08 51.78 51.84 81.99 121.92Q864-559.68 864-480q0 79.38-30 149.19T752-208.5Q700-156 629.87-126T480-96Zm0-384Zm.48 312q129.47 0 220.5-91.5Q792-351 792-480.48q0-129.47-91.02-220.5Q609.95-792 480.48-792 351-792 259.5-700.98 168-609.95 168-480.48 168-351 259.5-259.5T480.48-168Z" />
  </svg>
);

export const StarredIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg className={className} viewBox="0 -960 960 960" fill="currentColor">
    <path d="m352-293 128-76 129 76-34-144 111-95-147-13-59-137-59 137-147 13 112 95-34 144ZM243-144l63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Zm237-333Z" />
  </svg>
);

export const TrashIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

export const StorageIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    height={20}
    width={20}
  >
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3h-1v2h1c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z" />
  </svg>
);

export const QuestionIcon = () => (
  <svg
    className="wo35tf"
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="#000000"
    focusable="false"
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
  </svg>
);

export const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="#1f1f1f"
  >
    <path d="m403-96-22-114q-23-9-44.5-21T296-259l-110 37-77-133 87-76q-2-12-3-24t-1-25q0-13 1-25t3-24l-87-76 77-133 110 37q19-16 40.5-28t44.5-21l22-114h154l22 114q23 9 44.5 21t40.5 28l110-37 77 133-87 76q2 12 3 24t1 25q0 13-1 25t-3 24l87 76-77 133-110-37q-19 16-40.5 28T579-210L557-96H403Zm59-72h36l19-99q38-7 71-26t57-48l96 32 18-30-76-67q6-17 9.5-35.5T696-480q0-20-3.5-38.5T683-554l76-67-18-30-96 32q-24-29-57-48t-71-26l-19-99h-36l-19 99q-38 7-71 26t-57 48l-96-32-18 30 76 67q-6 17-9.5 35.5T264-480q0 20 3.5 38.5T277-406l-76 67 18 30 96-32q24 29 57 48t71 26l19 99Zm18-168q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102q0 60 42 102t102 42Zm0-144Z" />
  </svg>
);

const FileIcons: FileIcons = {
  mp4: <MdMovie className="h-full w-full text-[#CA2E24]" />,
  mp3: <IoMdHeadset className="h-full w-full text-[#CA2E24]" />,
  pdf: <MdPictureAsPdf className="h-full w-full text-[#CA2E24]" />,
  jpg: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  jpeg: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  png: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  jfif: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  gif: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  webp: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  ico: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  svg: <BiSolidImageAlt className="h-full w-full text-[#CA2E24]" />,
  docx: <BiSolidFileDoc className="h-full w-full text-[#447DD7]" />,
  txt: <BiSolidFileTxt className="h-full w-full text-[#447DD7]" />,
  zip: <AiFillFileZip className="h-full w-full text-textC" />,
  any: <AiFillFile className="h-full w-full text-textC" />,
};

export default FileIcons;
