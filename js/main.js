import { getData } from './api.js';
import { renderContainer } from './container.js';
import { showAlert } from './utils.js';

getData(
  (contractors) => renderContainer(contractors),
  () => showAlert('Ошибка при загрузке'),
);
