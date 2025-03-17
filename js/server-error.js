import { getData } from './api.js';
import { renderContainer } from './container.js';
import { saveContractorsData } from './contractors.js';
import { containerError, containerUsers, userProfile } from './elems.js';
import { renderUserData, saveUserData } from './user.js';
import { showAlert } from './utils.js';

const mocksBtn = document.querySelector('.btn-mocks');

const hideError = () => {
  userProfile.style = '';
  containerUsers.style = '';
  containerError.style.display = 'none';
};

const loadMocks = () => {
  getData(
    '../data/user.json',
    (user) => saveUserData(user, renderUserData),
    () => showAlert('Ошибка при загрузке тестовых данных'),
  );

  getData(
    '../data/contractors.json',
    (contractors) => saveContractorsData(contractors, renderContainer),
    () => showAlert('Ошибка при загрузке тестовых данных'),
  );

  hideError();

  mocksBtn.addEventListener('click', loadMocks);
};

export const showErrorServer = () => {
  userProfile.style.display = 'none';
  containerUsers.style.display = 'none';
  containerError.style = '';

  mocksBtn.addEventListener('click', loadMocks);
};
