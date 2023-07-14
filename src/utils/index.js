import crypto from "crypto";

const SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export const generateInitials = (name) => {
  const arr = name?.split(" ");
  if (arr) {
    const fText = arr[0]?.charAt(0);
    const sText = arr[1]?.charAt(0);
    return `${fText}${sText}`;
  }
  return "";
};

export const isSelectedChat = (chat, selectedChat) => {
  return selectedChat?._id === chat?._id;
};

export const isSameSender = (sender, user) => {
  return sender?._id === user?._id;
};

export const formatBytes = (bytes) => {
  let r = bytes,
    b = 1024,
    i = 0;
  for (i; r > b; i++) {
    r /= b;
  }
  return `${parseFloat(r.toFixed(2))} ${SIZES[i]}`;
};

export const generatePasscode = () => {
  return Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join("");
};

export const formatTime = (seconds) => {
  const format = (val) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;

  return [hours, minutes, seconds % 60].map(format).join(":");
};

export const encryptData = (content) => {
  const {
    REACT_APP_ENCRYPTION_ALGORITHM: algorithm,
    REACT_APP_ENCRYPTION_INIT_VECTOR: initVector,
    REACT_APP_ENCRYPTION_SECURITY_KEY: securityKey,
  } = process.env;

  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
  let encryptedData = cipher.update(content, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return encryptedData;
};

export function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}
