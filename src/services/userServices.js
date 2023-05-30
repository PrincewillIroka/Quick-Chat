import Cookies from "js-cookie";

const APP_HOST = process.env.REACT_APP_HOST;

const getChats = () => {
  const bs_token = Cookies.get("bs_token");

  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/users/getChats?bs_token=${bs_token}`;

    fetch(url)
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

export { getChats };
