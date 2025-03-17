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
  const min = (contractor.status === 'seller')
    ? contractor.minAmount * contractor.exchangeRate
    : contractor.minAmount / contractor.exchangeRate;

  const max = (contractor.status === 'seller')
    ? contractor.balance.amount * contractor.exchangeRate
    : contractor.balance.amount / contractor.exchangeRate;

  const currency = (contractor.status === 'seller') ? '₽' : 'KEKS';

  return (min === max)
    ? `${formatNumber(min)}&nbsp;${currency}&nbsp;`
    : `${formatNumber(min)}&nbsp;${currency}&nbsp;-&nbsp;${formatNumber(max)}&nbsp;${currency}`;
};

export {
  showAlert,
  formatNumber,
  getCashLimit,
};
