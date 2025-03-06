import { getData } from './api.js';
import { URL_GET_CONTRACTORS, URL_GET_USER } from './consts.js';
import { renderContainer } from './container.js';
import { renderUserData } from './user.js';
import { showAlert } from './utils.js';

getData(
  URL_GET_USER,
  (user) => renderUserData(user),
  () => showAlert('Ошибка при загрузке данных пользователя'),
);

getData(
  URL_GET_CONTRACTORS,
  (contractors) => renderContainer(contractors),
  () => showAlert('Ошибка при загрузке'),
);
