import { getUser } from './data.js';
import { userProfile } from './elems.js';

export const renderUserData = () => {
  const cryptoBalanceField = userProfile.querySelector('#user-crypto-balance');
  const fiatBalanceField = userProfile.querySelector('#user-fiat-balance');
  const nameField = userProfile.querySelector('.user-profile__name span');

  const user = getUser();

  cryptoBalanceField.textContent = user.balances
    .slice()
    .filter((balance) => balance.currency.toUpperCase() === 'KEKS')[0].amount;

  fiatBalanceField.textContent = user.balances
    .slice()
    .filter((balance) => balance.currency.toUpperCase() === 'RUB')[0].amount;

  nameField.textContent = user.userName;
};
