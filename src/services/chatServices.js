const APP_HOST = process.env.REACT_APP_HOST;

const createChat = (params) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/chats/create`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

const uploadFile = (payload) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/chats/upload`;

    fetch(url, {
      method: "POST",
      body: payload,
    })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

const updateAccessRight = ({ chat_id, user_id, passcode }) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/chats/updateAccessRight`;

    fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id, user_id, passcode }),
    })
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
};

export { createChat, uploadFile, updateAccessRight };
