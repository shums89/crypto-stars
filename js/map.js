import { loadModal } from './modal.js';
import { formatNumber, getCashLimit } from './utils.js';

const MAP_INIT_VALUES = {
  lat: 59.92749,
  lng: 30.31127,
  zoom: 9,
};

let map;
let markerGroup;

const createBaloon = (seller) => {
  const userCard = document.createElement('div');
  userCard.classList.add('user-card');

  let paymentMethods = [];

  if (seller.paymentMethods) {
    paymentMethods =
      seller.paymentMethods
        .slice().map((el) => `<li class="user-card__badges-item badge">${el.provider}</li>`)
        .join('')
      || '';
  }

  userCard.innerHTML = `
    <span class="user-card__user-name" style="width: 100%;">
      ${seller.isVerified ? '<svg width="20" height="20" aria-hidden="true"><use xlink:href="#icon-star"></use></svg>' : ''}
      <span>${seller.userName}</span>
    </span>
    <p class="user-card__cash-item">
      <span class="user-card__cash-label">Валюта</span>
      <span class="user-card__cash-data">KEKS</span>
    </p>
    <p class="user-card__cash-item">
      <span class="user-card__cash-label">Курс</span>
      <span class="user-card__cash-data">${formatNumber(seller.exchangeRate)} ₽</span>
    </p>
    <p class="user-card__cash-item">
      <span class="user-card__cash-label">Лимит</span>
      <span class="user-card__cash-data">${getCashLimit(seller)}</span>
    </p>
    <ul class="user-card__badges-list">${paymentMethods}</ul>
    <button class="btn btn--green user-card__change-btn" type="button">Обменять</button>
  `;

  userCard.querySelector('button').addEventListener('click', () => loadModal(seller.id));

  return userCard;
};

const renderMarkers = (sellers) => {
  markerGroup?.clearLayers();

  markerGroup = L.layerGroup().addTo(map);

  const createMarker = (seller) => {
    const { lat, lng } = seller.coords;
    const iconUrl = seller.isVerified ? '../img/pin-verified.svg' : '../img/pin.svg';

    const icon = L.icon({
      iconUrl: iconUrl,
      iconSize: [36, 46],
      iconAnchor: [18, 46],
    });

    const marker = L.marker(
      {
        lat,
        lng,
      },
      {
        icon,
      },
    );

    marker
      .addTo(markerGroup)
      .bindPopup(createBaloon(seller));
  };

  sellers.forEach((seller) => {
    createMarker(seller);
  });
};

const createMap = (sellers) => {
  map = L.map('map')
    .setView({
      lat: MAP_INIT_VALUES.lat,
      lng: MAP_INIT_VALUES.lng,
    }, MAP_INIT_VALUES.zoom);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);
};

const clearMap = () => {
  markerGroup?.clearLayers();
};

const renderMap = (sellers) => {
  if (!map) {
    createMap(sellers);
  }

  renderMarkers(sellers);
};

export {
  renderMap,
  clearMap,
};
