import { userProfile } from './elems.js';
import { formatNumber } from './utils.js';

const saveUserData = (data, cb) => {
  sessionStorage.removeItem('user');
  sessionStorage.user = JSON.stringify(data);

  cb(JSON.parse(sessionStorage.user));
};

const getUser = () => JSON.parse(sessionStorage.user);

const getUserBalance = (currency) => {
  const user = getUser();

  return user.balances
    .slice()
    .filter((balance) => balance.currency.toUpperCase() === currency.toUpperCase())[0].amount || 0;
};

const renderUserData = () => {
  const cryptoBalanceField = userProfile.querySelector('#user-crypto-balance');
  const fiatBalanceField = userProfile.querySelector('#user-fiat-balance');
  const nameField = userProfile.querySelector('.user-profile__name span');

  cryptoBalanceField.textContent = formatNumber(getUserBalance('KEKS'));
  fiatBalanceField.textContent = formatNumber(getUserBalance('RUB'));
  nameField.textContent = getUser().userName;
};

const updateBalanceUser = (changes) => {
  const user = getUser();

  user.balances.map((el) => { el.amount = +getUserBalance(el.currency) + changes[el.currency]; });

  saveUserData(user, renderUserData);
};

export {
  saveUserData,
  getUser,
  getUserBalance,
  renderUserData,
  updateBalanceUser,
};
