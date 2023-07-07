const APP_HOST = process.env.REACT_APP_HOST;

const addBookmark = (params) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/bookmarks/add`;

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

const getBookmarks = (params) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/bookmarks`;

    fetch(url, {
      method: "POST",
      credentials: "include",
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

const deleteBookmark = (params) => {
  return new Promise((resolve, reject) => {
    const url = `${APP_HOST}/api/bookmarks/delete`;

    fetch(url, {
      method: "DELETE",
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

export { addBookmark, getBookmarks, deleteBookmark };
