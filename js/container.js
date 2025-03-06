import { renderContractors } from './contractors.js';
import { nav } from './elems.js';

let contractors = [];

const filteredTabs = () => {
  const actionBtn = nav.querySelector('.tabs--toggle-buy-sell').querySelector('.is-active');
  const checkingVerifiedUsers = nav.querySelector('#checked-users');
  let filteredData = contractors.slice();

  if (checkingVerifiedUsers.checked) {
    filteredData = filteredData.filter((el) => el.isVerified === true);
  }

  if (actionBtn.matches('.btn-buy')) {
    filteredData = filteredData.filter((el) => el.status === 'seller');
  } else {
    filteredData = filteredData.filter((el) => el.status === 'buyer');
  }

  renderContractors(filteredData);
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

export const renderContainer = (data) => {
  contractors = data;
  filteredTabs();

  nav.addEventListener('click', toggleContainer);
};

