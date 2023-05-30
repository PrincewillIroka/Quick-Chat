import Cookies from "js-cookie";

const APP_HOST = process.env.REACT_APP_HOST;

const createChat = () => {
  const bs_token = Cookies.get("bs_token");

  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/chats/create`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bs_token }),
    })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

export { createChat };
