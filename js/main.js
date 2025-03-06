import { getData } from './api.js';
import { URL_GET_CONTRACTORS, URL_GET_USER } from './consts.js';
import { renderContainer } from './container.js';
import { saveContractorsData, saveUserData } from './data.js';
import { renderUserData } from './user.js';
import { showAlert } from './utils.js';

getData(
  URL_GET_USER,
  (user) => saveUserData(user, renderUserData),
  () => showAlert('Ошибка при загрузке данных пользователя'),
);

getData(
  URL_GET_CONTRACTORS,
  (contractors) => saveContractorsData(contractors, renderContainer),
  () => showAlert('Ошибка при загрузке контрагентов'),
);
