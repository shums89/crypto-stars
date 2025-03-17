import { renderContainer } from './container.js';
import { usersList } from './elems.js';
import { loadModal } from './modal.js';
import { formatNumber, getCashLimit } from './utils.js';

const saveContractorsData = (data, cb) => {
  sessionStorage.removeItem('contractors');
  sessionStorage.contractors = JSON.stringify(data);

  cb(JSON.parse(sessionStorage.contractors));
};

const getContractors = () => JSON.parse(sessionStorage.contractors);

const createRowElement = (contractor) => {
  const rowElement = document.createElement('tr');
  let paymentMethods = [];

  if (contractor.paymentMethods) {
    paymentMethods =
      contractor.paymentMethods
        .slice().map((el) => `<li class="users-list__badges-item badge">${el.provider}</li>`)
        .join('')
      || '';
  }

  rowElement.classList.add('users-list__table-row');
  rowElement.innerHTML = `
    <td class="users-list__table-cell users-list__table-name">
      ${contractor.isVerified ? '<svg width="20" height="20" aria-hidden="true"><use xlink:href="#icon-star"></use></svg>' : ''}
      <span>${contractor.userName}</span>
    </td >
    <td class="users-list__table-cell users-list__table-currency">keks</td>
    <td class="users-list__table-cell users-list__table-exchangerate">${formatNumber(contractor.exchangeRate)}&nbsp;₽</td>
    <td class="users-list__table-cell users-list__table-cashlimit">${getCashLimit(contractor)}</td>
    <td class="users-list__table-cell users-list__table-payments">
      <ul class="users-list__badges-list">${paymentMethods}</ul>
    </td>
    <td class="users-list__table-cell users-list__table-btn">
      <button class="btn btn--greenborder" type="button">Обменять</button>
    </td>
`;

  rowElement.querySelector('button').addEventListener('click', () => loadModal(contractor.id));

  return rowElement;
};

const renderContractors = (contractors) => {
  usersList.innerHTML = '';

  contractors.forEach((contractor) => usersList.appendChild(createRowElement(contractor)));
};

const updateBalanceContractor = (contractor, change) => {
  const contractors = getContractors();
  const balance = contractor.balance;

  const result = { balance };
  result.balance.amount = balance.amount - change;

  Object.assign(contractors.find((el) => el.id === contractor.id), result);

  saveContractorsData(contractors, renderContainer);
};

export {
  saveContractorsData,
  getContractors,
  renderContractors,
  updateBalanceContractor,
};
