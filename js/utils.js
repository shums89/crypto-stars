const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 100;
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 3000);
};

const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(Math.floor(value * 100) / 100);

const getCashLimit = (contractor) => {
  let min = 0;
  let max = 0;

  if (contractor.status === 'seller') {
    min = contractor.minAmount * contractor.exchangeRate;
    max = contractor.balance.amount * contractor.exchangeRate;

    return `${formatNumber(min)}&nbsp;₽&nbsp;-&nbsp;${formatNumber(max)}&nbsp;₽`;
  } else {
    min = contractor.minAmount / contractor.exchangeRate;
    max = contractor.balance.amount / contractor.exchangeRate;

    return `${formatNumber(min)}&nbsp;KEKS&nbsp;-&nbsp;${formatNumber(max)}&nbsp;KEKS`;
  }
};

export {
  showAlert,
  formatNumber,
  getCashLimit,
};
