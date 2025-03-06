import { renderContractors } from './contractors.js';
import { getContractors } from './data.js';
import { containerNoResult, containerUsers, nav } from './elems.js';

const hideNoResult = () => {
  containerUsers.querySelector('.users-list__table-body').style = '';
  containerNoResult.style.display = 'none';
};

const showNoResult = () => {
  containerUsers.querySelector('.users-list__table-body').style.display = 'none';
  containerNoResult.style = '';
};

const filteredTabs = () => {
  const actionBtn = nav.querySelector('.tabs--toggle-buy-sell').querySelector('.is-active');
  const checkingVerifiedUsers = nav.querySelector('#checked-users');

  let filteredData = getContractors().slice();

  if (checkingVerifiedUsers.checked) {
    filteredData = filteredData.filter((el) => el.isVerified);
  }

  if (actionBtn.matches('.btn-buy')) {
    filteredData = filteredData.filter((el) => el.status === 'seller');
  } else {
    filteredData = filteredData.filter((el) => el.status === 'buyer');
  }

  if (!filteredData.length) {
    showNoResult();
  } else {
    hideNoResult();
    renderContractors(filteredData);
  }
};

const toggleContainer = (evt) => {
  const target = evt.target;

  if (target.closest('.tabs--toggle-buy-sell') && target.matches('.tabs__control')) {
    const tabControls = nav.querySelector('.tabs--toggle-buy-sell').querySelectorAll('.tabs__control');

    tabControls.forEach((el) => {
      el.classList.toggle('is-active');
    });
  }

  if (target.closest('.tabs--toggle-list-map') && target.matches('.tabs__control')) {
    const tabControls = nav.querySelector('.tabs--toggle-list-map').querySelectorAll('.tabs__control');

    tabControls.forEach((el) => {
      el.classList.toggle('is-active');
    });
  }

  filteredTabs();
};

const renderContainer = () => {
  filteredTabs();

  nav.addEventListener('click', toggleContainer);
};

export {
  filteredTabs,
  renderContainer,
};
