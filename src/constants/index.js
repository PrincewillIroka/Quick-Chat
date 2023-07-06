import { FaRegFilePdf, FaRegFileAudio, FaRegFileVideo } from "react-icons/fa";
import {
  BsFiletypeDoc,
  BsFiletypeMp3,
  BsFiletypeMp4,
  BsFiletypeJson,
} from "react-icons/bs";
import { AiOutlineFile } from "react-icons/ai";

const PHOTO_EXTENSIONS = ["image"];
const VIDEO_EXTENSIONS = ["video", "audio"];
const LINK_EXTENSIONS = ["application"];

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
  } else if (mimetype.includes("word")) {
    icon = <BsFiletypeDoc className={className} />;
  } else if (mimetype.includes("mp3")) {
    icon = <BsFiletypeMp3 className={className} />;
  } else if (mimetype.includes("mp4")) {
    icon = <BsFiletypeMp4 className={className} />;
  } else if (mimetype.includes("json")) {
    icon = <BsFiletypeJson className={className} />;
  } else if (mimetype.includes("octet-stream") || mimetype.includes("audio")) {
    icon = <FaRegFileAudio className={className} />;
  } else if (mimetype.includes("video")) {
    icon = <FaRegFileVideo className={className} />;
  } else {
    icon = <AiOutlineFile className={className} />;
  }

  return icon;
};

export { mediaTypesObj, mediaTypesArr, getAttachmentIcon };
