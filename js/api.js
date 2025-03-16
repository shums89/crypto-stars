import { URL_POST } from './consts.js';

const getData = (url, onSuccess, onFail) => {
  fetch(url)
    .then((response) => response.json())
    .then((contractors) => {
      onSuccess(contractors);
    })
    .catch(() => {
      onFail();
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    URL_POST,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
};

export { getData, sendData };
