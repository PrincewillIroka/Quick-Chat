import React, { useMemo } from "react";
import PhotosSvg from "assets/Photos.svg";
import VideosSvg from "assets/Video.svg";
import LinksSvg from "assets/Links.svg";
import { useStateValue } from "store/stateProvider";
import {
  mediaTypesObj,
  mediaTypesArr,
  getAttachmentIcon,
} from "constants/index";
import "./ChatMedia.css";

function ChatMedia() {
  const { state = {} } = useStateValue();
  const { selectedChat = {} } = state;
  const { messages = [] } = selectedChat;

  const chatAttachments = useMemo(() => {
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

  return (
    <div className="chat-media-info-container">
      <h4 className="chat-media-title">Media</h4>
      <div className="chat-media-info-wrapper">
        <div className="chat-media-photos-row">
          <h5>Photos</h5>
          {chatAttachments["photos"]?.length ? (
            <div className="chat-media-content-container">
              {chatAttachments["photos"].map(({ attachment }, index) => {
                const { file_url, name } = attachment;
                return (
                  <div key={index} className="chat-media-img-wrapper">
                    <img
                      src={file_url}
                      className="chat-media-img"
                      alt={name}
                      onClick={() => handleViewFile(file_url)}
                      title={name}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="chat-media-svg-container">
              <img src={PhotosSvg} className="photos-svg" alt="" />
              <span>Add Photos</span>
            </div>
          )}
        </div>
        <div className="chat-media-videos-row">
          <h5>Videos</h5>
          {chatAttachments["videos"]?.length ? (
            <div className="chat-media-content-container">
              {chatAttachments["videos"].map(({ attachment }, index) => {
                const { file_url, name, mimetype } = attachment;
                return (
                  <video
                    key={index}
                    className="chat-media-video"
                    onClick={() => handleViewFile(file_url)}
                    controls
                    autoPlay
                    loop
                    muted
                    poster={file_url}
                    title={name}
                  >
                    <source src={file_url} type={mimetype} />
                  </video>
                );
              })}
            </div>
          ) : (
            <div className="chat-media-svg-container">
              <img src={VideosSvg} className="videos-svg" alt="" />
              <span>Add Videos</span>
            </div>
          )}
        </div>
        <div className="chat-media-links-row">
          <h5>Links</h5>
          {chatAttachments["links"]?.length ? (
            <div className="chat-media-content-container">
              <div className="chat-links-content-wrapper">
                {chatAttachments["links"].map(({ attachment }, index) => {
                  const { file_url, name, mimetype } = attachment;
                  return (
                    <div
                      className="chat-links-single-wrapper"
                      onClick={() => handleViewFile(file_url)}
                      key={index}
                      title={name}
                    >
                      <span className="chat-links-icon-wrapper">
                        {getAttachmentIcon(mimetype, "chat-links-icon")}
                      </span>
                      <span>{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="chat-media-svg-container">
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
