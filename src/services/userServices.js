// import Cookies from "js-cookie";

const APP_HOST = process.env.REACT_APP_HOST;

const getChats = ({ bs_token, chatUrlParam }) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/users/getChats`;

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bs_token, chatUrlParam }),
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
  // const bs_token = Cookies.get("bs_token");
  const bs_token = localStorage.getItem("bs_token");
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/users/authenticateUser`;

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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

const updateUser = async ({ user_id, username }) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/users/updateUser`;
    fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, username }),
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

export { getChats, authenticateUser, updateUser };
