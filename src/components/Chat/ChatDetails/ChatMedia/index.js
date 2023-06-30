import React, { useMemo } from "react";
import PhotosSvg from "assets/Photos.svg";
import VideosSvg from "assets/Video.svg";
import LinksSvg from "assets/Links.svg";
import { useStateValue } from "store/stateProvider";
import "./ChatMedia.css";

const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const VIDEO_EXTENSIONS = ["mp4", "wav", "mp3", "avi"];
const LINK_EXTENSIONS = ["pdf", "word", "xls", "ppt"];

const mediaTypesObj = {
  photos: PHOTO_EXTENSIONS,
  videos: VIDEO_EXTENSIONS,
  links: LINK_EXTENSIONS,
};
const mediaTypesArr = ["photos", "videos", "links"];

function ChatMedia() {
  const { state = {} } = useStateValue();
  const { selectedChat = {} } = state;
  const { messages = [] } = selectedChat;

  console.log({ selectedChat });

  const photoAttachments = useMemo(() => {
    return messages.reduce((acc, curr) => {
      const { attachments = [] } = curr;

      mediaTypesArr.forEach((mediaType) => {
        acc[mediaType] = acc[mediaType] || [];
        const mediaFilesFound = attachments.find(({ attachment }) => {
          let { mimetype = "", isUploading = "" } = attachment;
          mimetype = mimetype.split("/");
          mimetype = mimetype[1] || "";
          const isFound =
            mediaTypesObj[mediaType].includes(mimetype) &&
            isUploading === "Completed";
          return isFound;
        });

        if (mediaFilesFound) {
          acc[mediaType] = acc[mediaType].concat([mediaFilesFound]);
        }
      });
      return acc;
    }, {});
  }, [messages]);

  const handleViewFile = (file_url) => {
    window.open(file_url);
  };

  console.log({ photoAttachments });

  return (
    <div className="chat-details-info-container">
      <h4 className="chat-media-title">Media</h4>
      <div className="chat-details-info-wrapper">
        <div className="chat-details-photos-row">
          <h5>Photos</h5>
          {photoAttachments["photos"]?.length ? (
            <div className="chat-details-content-container">
              {photoAttachments["photos"].map(({ attachment }, index) => {
                const { file_url, name } = attachment;
                return (
                  <img
                    key={index}
                    src={file_url}
                    className="chat-details-img"
                    alt={name}
                    onClick={() => handleViewFile(file_url)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="chat-details-svg-container">
              <img src={PhotosSvg} className="photos-svg" alt="" />
              <span>Add Photos</span>
            </div>
          )}
        </div>
        <div className="chat-details-videos-row">
          <h5>Videos</h5>
          {photoAttachments["videos"]?.length ? (
            <div className="chat-details-content-container">
              {photoAttachments["videos"].map(({ attachment }, index) => {
                const { file_url, mimetype } = attachment;
                return (
                  <video
                    key={index}
                    className="chat-details-video"
                    onClick={() => handleViewFile(file_url)}
                    controls
                    autoPlay
                    loop
                    muted
                    poster={file_url}
                  >
                    <source src={file_url} type={mimetype} />
                  </video>
                );
              })}
            </div>
          ) : (
            <div className="chat-details-svg-container">
              <img src={VideosSvg} className="videos-svg" alt="" />
              <span>Add Videos</span>
            </div>
          )}
        </div>
        <div className="chat-details-links-row">
          <h5>Links</h5>
          {photoAttachments["links"]?.length ? (
            <div className="chat-details-content-container">
              {photoAttachments["links"].map(({ attachment }, index) => {
                const { file_url, name } = attachment;
                return (
                  <img
                    key={index}
                    src={file_url}
                    className="chat-details-links"
                    alt={name}
                    onClick={() => handleViewFile(file_url)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="chat-details-svg-container">
              <img src={LinksSvg} className="links-svg" alt="" />
              <span>Add Links</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMedia;
