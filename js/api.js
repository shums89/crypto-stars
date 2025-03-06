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

const sendData = (onSuccess, onFail, onFinally, body) => {
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
        onFail('Не удалось отправить форму. Попробуйте ещё раз');
      }
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте ещё раз');
    })
    .finally(() => {
      onFinally();
    });
};

export { getData, sendData };
