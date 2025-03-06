import { URL_GET_CONTRACTORS, URL_POST } from './consts.js';

const getData = (onSuccess, onFail) => {
  fetch(URL_GET_CONTRACTORS)
    .then((response) => response.json())
    .then((contractors) => {
      onSuccess(contractors);
    })
    .catch((error) => {
      console.log(error);
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
