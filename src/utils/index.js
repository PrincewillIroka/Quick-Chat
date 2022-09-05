export const generateInitials = (name) => {
  const arr = name?.split(" ");
  if (arr) {
    const fText = arr[0].charAt(0);
    const sText = arr[1].charAt(0);
    return `${fText}${sText}`;
  }
  return "";
};
