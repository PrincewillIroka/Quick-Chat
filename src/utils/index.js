const SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export const generateInitials = (name) => {
  const arr = name?.split(" ");
  if (arr) {
    const fText = arr[0].charAt(0);
    const sText = arr[1].charAt(0);
    return `${fText}${sText}`;
  }
  return "";
};

export const isSelectedChat = (chat, selectedChat) => {
  return selectedChat?._id === chat?._id;
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
