import { getContractors, getUser } from './data.js';
import { modalBuy, modalSell } from './elems.js';
import { getUserBalance } from './user.js';
import { getCashLimit } from './utils.js';

let modal;
let form;
let contractor;
let exchangeAllBtns;
let payment;
let crediting;
let paymentMethods;

const getPaymentMethods = (prop) => {
  paymentMethods.innerHTML = prop.paymentMethods
    .slice()
    .reduce((acc, cur) => `${acc}<option value="${cur.accountNumber || ''}">${cur.provider}</option>`,
      '<option selected disabled>Выберите платёжную систему</option>'
    );
};

const onChangePayment = () => {
  crediting.value = (contractor.status === 'seller') ?
    Math.floor(payment.value / contractor.exchangeRate * 100) / 100 :
    Math.floor(payment.value * contractor.exchangeRate * 100) / 100;
};

const onChangeCrediting = () => {
  payment.value = (contractor.status === 'seller') ?
    Math.floor(crediting.value * contractor.exchangeRate * 100) / 100 :
    Math.floor(crediting.value / contractor.exchangeRate * 100) / 100;
};

const onSubmit = (evt) => {
  evt.preventDefault();
};

const exchangeAll = ({ target }) => {
  if (target.matches('[data-modal-payment]')) {
    payment.value = (contractor.status === 'seller') ?
      Math.floor(getUserBalance('RUB') * 100) / 100 :
      Math.floor(getUserBalance('KEKS') * 100) / 100;

    onChangePayment();
  }

  if (target.matches('[data-modal-crediting]')) {
    crediting.value = Math.floor(contractor.balance.amount * 100) / 100;

    onChangeCrediting();
  }
};

const onChangePaymentMethods = ({ target }) => {
  const accountNumber = form.querySelector('input[data-modal-account-number]');

  accountNumber.value = target.value.split(' ').join('').replace(/(\d)(?=(\d\d\d\d)+([^\d]|$))/g, '$1 ');
};

const onClose = ({ target }) => {
  if (!target.closest('.modal__content') || target.closest('.modal__close-btn')) {
    modal.style.display = 'none';
    form.reset();

    exchangeAllBtns.forEach((el) => el.removeEventListener('click', exchangeAll));
    payment.removeEventListener('input', onChangePayment);
    crediting.removeEventListener('input', onChangeCrediting);
    paymentMethods.removeEventListener('change', onChangePaymentMethods);
    form.removeEventListener('submit', onSubmit);
    modal.removeEventListener('click', onClose);
  }
};

const renderModal = () => {
  const userVerified = modal.querySelector('.transaction-info__data--user svg');
  const userName = modal.querySelector('.transaction-info__data--user span');
  const exchangeRate = modal.querySelector('.transaction-info__item--exchangerate .transaction-info__data');
  const cashLimit = modal.querySelector('.transaction-info__item--cashlimit .transaction-info__data');
  const walletAddress = modal.querySelector('input[data-modal-wallet-address]');

  let max = 0;

  if (contractor.isVerified) {
    userVerified.classList.remove('visually-hidden');
  } else {
    userVerified.classList.add('visually-hidden');
  }

  userName.textContent = contractor.userName;
  exchangeRate.textContent = contractor.exchangeRate;
  cashLimit.innerHTML = getCashLimit(contractor);

  if (contractor.status === 'seller') {
    payment.min = Math.floor(contractor.minAmount * contractor.exchangeRate * 100) / 100;

    max = Math.floor(getUserBalance('RUB') * 100) / 100;
    payment.max = (+max >= +payment.min) ? payment.max = max : '';

    getPaymentMethods(contractor);
    walletAddress.value = getUser().wallet.address;
  } else {
    payment.min = Math.floor(contractor.minAmount / contractor.exchangeRate * 100) / 100;

    max = Math.floor(getUserBalance('KEKS') * 100) / 100;
    payment.max = (+max >= +payment.min) ? payment.max = max : '';

    getPaymentMethods(getUser());
    walletAddress.value = contractor.wallet.address;
  }

  crediting.min = Math.floor(contractor.minAmount * 100) / 100;
  crediting.max = Math.floor(contractor.balance.amount * 100) / 100;
  payment.placeholder = payment.min;
  crediting.placeholder = crediting.min;

  modal.style = '';

  exchangeAllBtns.forEach((el) => el.addEventListener('click', exchangeAll));
  payment.addEventListener('input', onChangePayment);
  crediting.addEventListener('input', onChangeCrediting);
  paymentMethods.addEventListener('change', onChangePaymentMethods);
  form.addEventListener('submit', onSubmit);
  modal.addEventListener('click', onClose);
};

export const loadModal = (id) => {
  contractor = getContractors().filter((el) => el.id === id)[0];

  modal = contractor.status === 'seller' ? modalBuy : modalSell;
  form = modal.querySelector('form');
  payment = form.querySelector('input[data-modal-payment]');
  crediting = form.querySelector('input[data-modal-crediting]');
  exchangeAllBtns = modal.querySelectorAll('button[data-modal]');
  paymentMethods = form.querySelector('select[data-modal-payment-methods]');

  renderModal();
};
