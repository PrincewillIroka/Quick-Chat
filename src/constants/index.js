import { FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeDoc } from "react-icons/bs";

const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const VIDEO_EXTENSIONS = ["mp4", "wav", "mp3", "avi"];
const LINK_EXTENSIONS = ["pdf", "doc", "xls", "ppt", "epub", "gz", "html"];

const mediaTypesObj = {
  photos: PHOTO_EXTENSIONS,
  videos: VIDEO_EXTENSIONS,
  links: LINK_EXTENSIONS,
};
const mediaTypesArr = ["photos", "videos", "links"];

const getAttachmentIcon = (mimetype, className) => {
  let icon;

  if (mimetype.includes("pdf")) {
    icon = <FaRegFilePdf className={className} />;
  } else if (mimetype.includes("pdf")) {
    icon = <BsFiletypeDoc className={className} />;
  }

  return icon;
};

export { mediaTypesObj, mediaTypesArr, getAttachmentIcon };
