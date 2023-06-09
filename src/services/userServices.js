import Cookies from "js-cookie";

const APP_HOST = process.env.REACT_APP_HOST;

const getChats = (chatUrlParam) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/users/getChats?chatUrlParam=${chatUrlParam}`;

    fetch(url, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

const authenticateUser = () => {
  const bs_token = Cookies.get("bs_token");
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/users/authenticateUser`;

    fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ bs_token }),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

export { getChats, authenticateUser };
