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

export { createChat };
