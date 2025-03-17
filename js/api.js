import { URL_POST } from './consts.js';
import { showAlert } from './utils.js';

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
        return Promise.reject(response);
      }
    })
    .catch((response) => {
      onFail();
      response
        .json()
        .then((json) => {
          const message = json.reduce((acc, cur) => `${(acc === '') ? acc : `, ${acc}`} ${cur.errorMessage}`, '');

          showAlert(message);
        });
    });
};

export { getData, sendData };
