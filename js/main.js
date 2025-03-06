import { getData } from './api.js';
import { URL_GET_CONTRACTORS, URL_GET_USER } from './consts.js';
import { renderContainer } from './container.js';
import { saveContractorsData, saveUserData } from './data.js';
import { showErrorServer } from './server-error.js';
import { renderUserData } from './user.js';

getData(
  URL_GET_USER,
  (user) => saveUserData(user, renderUserData),
  showErrorServer,
);

getData(
  URL_GET_CONTRACTORS,
  (contractors) => saveContractorsData(contractors, renderContainer),
  showErrorServer,
);
