import { getContractors, renderContractors } from './contractors.js';
import { containerMap, containerNoResult, containerUsers, nav } from './elems.js';
import { clearMap, renderMap } from './map.js';

const hideNoResult = () => {
  containerUsers.querySelector('.users-list__table-body').style = '';
  containerNoResult.style.display = 'none';
};

const showNoResult = () => {
  containerUsers.querySelector('.users-list__table-body').style.display = 'none';
  containerNoResult.style = '';
};

const getStatusBuyTab = () => {
  const toggle = document.querySelector('.tabs--toggle-buy-sell').querySelector('.tabs__control.is-active');

  return toggle.matches('.btn-buy');
};

const getStatusMapTab = () => {
  const toggle = document.querySelector('.tabs--toggle-list-map').querySelector('.tabs__control.is-active');

  return toggle.matches('.btn-map');
};

const renderData = (data) => {
  if (getStatusMapTab()) {
    containerUsers.querySelector('.users-list').style.display = 'none';
    containerMap.style = '';

    if (getStatusBuyTab()) {
      renderMap(data);
    } else {
      clearMap();
    }
  } else {
    containerMap.style.display = 'none';
    containerUsers.querySelector('.users-list').style = '';

    if (!data.length) {
      showNoResult();
    } else {
      hideNoResult();
      renderContractors(data);
    }
  }
};

const filteredTabs = () => {
  const checkingVerifiedUsers = nav.querySelector('#checked-users');

  let filteredData = getContractors().slice();

  if (checkingVerifiedUsers.checked) {
    filteredData = filteredData.filter((el) => el.isVerified);
  }

  if (getStatusBuyTab()) {
    filteredData = filteredData.filter((el) => el.status === 'seller');
    if (getStatusMapTab()) {
      filteredData = filteredData.filter((el) => el.paymentMethods.some((elem) => elem.provider.toLowerCase() === 'cash in person'));
    }
  } else {
    filteredData = filteredData.filter((el) => el.status === 'buyer');
  }

  renderData(filteredData);
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
