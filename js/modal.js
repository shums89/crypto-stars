import { sendData } from './api.js';
import { getContractors, getUser } from './data.js';
import { modalBuy, modalSell } from './elems.js';
import { getUserBalance } from './user.js';
import { formatNumber, getCashLimit } from './utils.js';

const body = document.querySelector('body');

let modal;
let form;
let contractor;
let exchangeAllBtns;
let payment;
let crediting;
let paymentMethods;
let pristine;

const getPaymentMethods = (data) => {
  paymentMethods.innerHTML = data.paymentMethods
    .slice()
    .reduce((acc, cur) => `${acc}<option value="${cur.provider || ''}">${cur.provider}</option>`,
      '<option selected disabled>Выберите платёжную систему</option>'
    );
};

const validatePaymentMethod = () => {
  const validatePrice = () => {
    const valueDefault = form.querySelector('select[data-modal-payment-methods]')[0].value;
    const value = form.querySelector('select[data-modal-payment-methods]').value;

    return valueDefault !== value;
  }

  pristine.addValidator(paymentMethods, validatePrice, () => 'Обязательноее поле', 5, true);
};

const getPriceExtremums = () => {
  const max = (contractor.status === 'seller') ? getUserBalance('RUB') : getUserBalance('KEKS');

  const priceExtremums = {
    payment: {
      'min': (contractor.status === 'seller')
        ? contractor.minAmount * contractor.exchangeRate
        : contractor.minAmount / contractor.exchangeRate,
    },
    crediting: {
      'min': contractor.minAmount,
      'max': contractor.balance.amount,
    },
  };

  priceExtremums.payment.max = (+max >= +priceExtremums.payment.min) ? max : null;

  return priceExtremums;
};

const validatePrice = () => {
  const priceExtremums = getPriceExtremums();

  const checkPrice = (data, value) => value.length && data.max !== null && +value >= data.min && +value <= data.max;

  const getPriceErrorMessage = (data) => {
    if (data.max === null) {
      return 'Недостаточно средств на счете';
    }

    return `Значение от ${formatNumber(data.min)} до ${formatNumber(data.max)}`;
  };

  pristine.addValidator(payment,
    (value) => checkPrice(priceExtremums.payment, value), () => getPriceErrorMessage(priceExtremums.payment), 5, true
  );

  pristine.addValidator(crediting,
    (value) => checkPrice(priceExtremums.crediting, value), () => getPriceErrorMessage(priceExtremums.crediting), 5, true
  );

  pristine.validate(payment);
  pristine.validate(crediting);
};

const onChangePayment = () => {
  crediting.value = (contractor.status === 'seller')
    ? payment.value / contractor.exchangeRate
    : payment.value * contractor.exchangeRate;

  validatePrice();
};

const onChangeCrediting = () => {
  payment.value = (contractor.status === 'seller')
    ? crediting.value * contractor.exchangeRate
    : crediting.value / contractor.exchangeRate;

  validatePrice();
};

const showMessageSubmit = (type) => {
  const message = (type === 'success')
    ? form.querySelector('.modal__validation-message--success')
    : form.querySelector('.modal__validation-message--error');

  message.classList.remove('visually-hidden');

  setTimeout(() => {
    message.classList.add('visually-hidden');
  }, 3000);
};

const onSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  const formData = new FormData(evt.target);

  // for (let [key, value] of formData) {
  //   console.log(`${key} — ${value}`)
  // }

  if (isValid) {
    sendData(
      () => {
        showMessageSubmit('success');
        form.reset('');
      },
      () => showMessageSubmit('error'),
      formData,
    );
  }
};

const exchangeAll = ({ target }) => {
  if (target.matches('[data-modal-payment]')) {
    payment.value = (contractor.status === 'seller') ?
      getUserBalance('RUB') :
      getUserBalance('KEKS');

    onChangePayment();
    validatePrice();
  }

  if (target.matches('[data-modal-crediting]')) {
    crediting.value = contractor.balance.amount;

    onChangeCrediting();
  }
};

const onChangePaymentMethods = ({ target }) => {
  const accountNumber = form.querySelector('input[data-modal-account-number]');

  const data = (contractor.status === 'seller') ? contractor : getUser();

  accountNumber.value = data.paymentMethods
    .filter((el) => el.provider === target.value)[0].accountNumber?.split(' ').join('')
    .replace(/(\d)(?=(\d\d\d\d)+([^\d]|$))/g, '$1 ') || '';

  pristine.validate(paymentMethods);
};

const onClose = ({ target }) => {
  if (!target.closest('.modal__content') || target.closest('.modal__close-btn')) {
    modal.style.display = 'none';
    body.classList.remove('scroll-lock');
    pristine.destroy();
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

  form.querySelector('input[name="contractorId"]').value = contractor.id;
  form.querySelector('input[name="exchangeRate"]').value = contractor.exchangeRate;
  form.querySelector('input[name="sendingCurrency"]').value = (contractor.status === 'seller') ? 'RUB' : 'KEKS';
  form.querySelector('input[name="receivingCurrency"]').value = (contractor.status === 'seller') ? 'KEKS' : 'RUB';

  const priceExtremums = getPriceExtremums();

  if (contractor.isVerified) {
    userVerified.classList.remove('visually-hidden');
  } else {
    userVerified.classList.add('visually-hidden');
  }

  userName.textContent = contractor.userName;
  exchangeRate.textContent = contractor.exchangeRate;
  cashLimit.innerHTML = getCashLimit(contractor);

  // payment.min = priceExtremums.payment.min;
  // payment.max = priceExtremums.payment.max;
  payment.placeholder = priceExtremums.payment.min;

  // crediting.min = priceExtremums.crediting.min;
  // crediting.max = priceExtremums.crediting.max;
  crediting.placeholder = priceExtremums.crediting.min;

  if (contractor.status === 'seller') {
    getPaymentMethods(contractor);
    walletAddress.value = getUser().wallet.address;
  } else {
    getPaymentMethods(getUser());
    walletAddress.value = contractor.wallet.address;
  }

  validatePaymentMethod();

  modal.style = '';
  body.classList.add('scroll-lock');

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

  pristine = new Pristine(form, {
    classTo: 'custom-input',
    errorTextParent: 'custom-input',
    errorTextClass: 'custom-input__error',
  });

  renderModal();
};
