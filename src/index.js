import './style.css';
import dateFormat from 'date-fns/format';
import getWeather from './weather';

const initialCard = document.querySelector('.initial');
const searchBoxes = document.querySelectorAll('.search-box');
const mainContainer = document.querySelector('.main');
let isInitialCardVisible = true;

const updatePageTitle = (response) => {
  document.title = `${response.location.name}, ${response.location.country} | Tenki no Kyou`;
};

const getMoonPhaseSVG = (response) => {
  switch (response.forecast.forecastday[0].astro.moon_phase) {
    case 'New Moon':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-new</title><path d="M12 20A8 8 0 1 1 20 12A8 8 0 0 1 12 20M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Z" /></svg>';
    case 'Waxing Crescent':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-waxing-crescent</title><path d="M12 2A9.91 9.91 0 0 0 9 2.46A10 10 0 0 1 9 21.54A10 10 0 1 0 12 2Z" /></svg>';
    case 'First Quarter':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-first-quarter</title><path d="M12 2V22A10 10 0 0 0 12 2Z" /></svg>';
    case 'Waxing Gibbous':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-waxing-gibbous</title><path d="M6 12C6 7.5 7.93 3.26 12 2A10 10 0 0 1 12 22C7.93 20.74 6 16.5 6 12Z" /></svg>';
    case 'Full Moon':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-full</title><path d="M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z" /></svg>';
    case 'Waning Gibbous':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-waning-gibbous</title><path d="M18 12C18 7.5 16.08 3.26 12 2A10 10 0 0 0 12 22C16.08 20.74 18 16.5 18 12Z" /></svg>';
    case 'Last Quarter':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-last-quarter</title><path d="M12 2A10 10 0 0 0 12 22Z" /></svg>';
    case 'Waning Crescent':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-waning-crescent</title><path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" /></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-full</title><path d="M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z" /></svg>';
  }
};

const fadeInCard = (card) => {
  card.classList.add('fade-in');
  card.addEventListener('animationend', () => {
    card.classList.remove('fade-in');
    card.classList.remove('hidden');
  }, { once: true });
};

const fadeInCards = () => {
  document
    .querySelectorAll('.main > .card:not(.header)')
    .forEach((card) => {
      fadeInCard(card);
    });
};

const fadeInHeader = () => {
  const header = document.querySelector('.header.card');
  fadeInCard(header);
};

const showCardLoadingAnimation = () => new Promise((resolve, reject) => {
  if (isInitialCardVisible) {
    initialCard.classList.add('hide-content');
    initialCard.classList.add('loading');
    resolve();
  } else {
    document
      .querySelectorAll('.main > .card:not(.header)')
      .forEach((card) => {
        card.classList.add('hide-content');
        card.classList.add('loading');
        card.addEventListener('transitionend', () => resolve(), { once: true });
      });
  }
});

const cancelCardLoadingAnimation = () => new Promise((resolve, reject) => {
  if (isInitialCardVisible) {
    initialCard.classList.remove('hide-content');
    initialCard.classList.remove('loading');
    resolve();
  } else {
    document
      .querySelectorAll('.main > .card:not(.header)')
      .forEach((card) => {
        card.classList.remove('hide-content');
        card.classList.remove('loading');
        card.addEventListener('transitionend', () => resolve(), { once: true });
      });
  }
});

const generateCurrentWeatherCard = (response) => {
  const card = document.createElement('div');
  card.classList.add('current-weather', 'card', 'hidden');

  const h2 = document.createElement('h2');
  h2.textContent = 'Current Weather';

  const span = document.createElement('span');
  span.textContent = ` as of ${dateFormat(new Date(response.current.last_updated), 'p')}`;

  const content = document.createElement('div');
  content.classList.add('content');

  const currentLocation = document.createElement('p');
  currentLocation.classList.add('current-location');
  currentLocation.textContent = `${response.location.name}, ${response.location.country}`;

  const currentConditionIcon = document.createElement('img');
  currentConditionIcon.classList.add('current-condition-icon');
  currentConditionIcon.src = `http:${response.current.condition.icon.replace('64x64', '128x128')}`;
  currentConditionIcon.alt = response.current.condition.text;

  const currentTemp = document.createElement('p');
  currentTemp.classList.add('current-temp');

  const p = document.createElement('p');
  p.textContent = `${response.current.temp_c}°`;

  const span2 = document.createElement('span');
  span2.textContent = 'C';

  const currentFeelsLike = document.createElement('p');
  currentFeelsLike.classList.add('current-feels-like');
  currentFeelsLike.textContent = `Feels like ${response.current.feelslike_c}°`;

  const currentConditionText = document.createElement('p');
  currentConditionText.classList.add('current-condition-text');
  currentConditionText.textContent = response.current.condition.text;

  h2.appendChild(span);
  p.appendChild(span2);
  currentTemp.appendChild(p);
  content.appendChild(currentLocation);
  content.appendChild(currentConditionIcon);
  content.appendChild(currentTemp);
  content.appendChild(currentFeelsLike);
  content.appendChild(currentConditionText);
  card.appendChild(h2);
  card.appendChild(content);
  mainContainer.appendChild(card);
};

const generateTodaysConditionCard = (response) => {
  const card = document.createElement('div');
  card.classList.add('card', 'hidden');

  const h2 = document.createElement('h2');
  h2.textContent = "Today's Conditions";

  const conditions = document.createElement('div');
  conditions.classList.add('conditions');

  const conditionsInput = [
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>thermometer</title><path d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"></path></svg>',
      description: 'High/Low',
      value: `${response.forecast.forecastday[0].day.maxtemp_c}°/${response.forecast.forecastday[0].day.mintemp_c}°`,
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-rainy</title><path d="M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59"></path></svg>',
      description: 'Chances of Rain',
      value: `${response.forecast.forecastday[0].day.daily_chance_of_rain}%`,
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-snowy</title><path d="M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z"></path></svg>',
      description: 'Chances of Snow',
      value: `${response.forecast.forecastday[0].day.daily_chance_of_snow}%`,
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-windy</title><path d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z"></path></svg>',
      description: 'Wind',
      value: `${response.current.wind_kph} kph ${response.current.wind_dir}`,
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>water-circle</title><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 19C9.24 19 7 16.76 7 14C7 10.67 12 5.04 12 5.04S17 10.67 17 14C17 16.76 14.76 19 12 19Z"></path></svg>',
      description: 'Humidity',
      value: `${response.current.humidity}%`,
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>format-vertical-align-center</title><path d="M8,19H11V23H13V19H16L12,15L8,19M16,5H13V1H11V5H8L12,9L16,5M4,11V13H20V11H4Z"></path></svg>',
      description: 'Pressure',
      value: `${response.current.pressure_mb} mb`,
    },
  ];

  const content = document.createElement('div');
  content.classList.add('content');

  const content1 = document.createElement('div');
  const content2 = document.createElement('div');

  conditionsInput.forEach((input, index) => {
    const conditionEntry = document.createElement('div');
    conditionEntry.classList.add('condition-entry');

    const svg = document.createElement('div');

    const description = document.createElement('p');
    description.textContent = input.description;

    const value = document.createElement('p');
    value.textContent = input.value;

    conditionEntry.appendChild(svg);
    conditionEntry.appendChild(description);
    conditionEntry.appendChild(value);

    if (index < 3) {
      content1.appendChild(conditionEntry);
    } else if ((index < 6) && (index >= 3)) {
      content2.appendChild(conditionEntry);
    }

    svg.outerHTML = input.svg;
  });

  const astroConditionsInput = [
    {
      description: 'Rise',
      value: response.forecast.forecastday[0].astro.sunrise,
    },
    {
      description: 'Set',
      value: response.forecast.forecastday[0].astro.sunset,
    },
    {
      description: 'UV Index',
      value: `${response.forecast.forecastday[0].day.uv} of 11`,
    },
    {
      description: 'Rise',
      value: response.forecast.forecastday[0].astro.moonrise,
    },
    {
      description: 'Set',
      value: response.forecast.forecastday[0].astro.moonset,
    },
    {
      description: 'Phase',
      value: response.forecast.forecastday[0].astro.moon_phase,
    },
  ];

  const astroContent = document.createElement('div');
  astroContent.classList.add('content', 'astro');

  const astroContent1 = document.createElement('div');
  const astroContent2 = document.createElement('div');

  const astroContent1svg = document.createElement('svg');
  const astroContent2svg = document.createElement('svg');

  astroContent1.appendChild(astroContent1svg);
  astroContent2.appendChild(astroContent2svg);

  astroContent1svg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>white-balance-sunny</title><path d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13"></path></svg>';
  astroContent2svg.outerHTML = getMoonPhaseSVG(response);

  astroConditionsInput.forEach((input, index) => {
    const conditionEntry = document.createElement('div');
    conditionEntry.classList.add('condition-entry');

    const description = document.createElement('p');
    description.textContent = input.description;

    const value = document.createElement('p');
    value.textContent = input.value;

    conditionEntry.appendChild(description);
    conditionEntry.appendChild(value);

    if (index < 3) {
      astroContent1.appendChild(conditionEntry);
    } else if ((index < 6) && (index >= 3)) {
      astroContent2.appendChild(conditionEntry);
    }
  });

  content.appendChild(content1);
  content.appendChild(content2);
  conditions.appendChild(content);
  astroContent.appendChild(astroContent1);
  astroContent.appendChild(astroContent2);
  conditions.appendChild(astroContent);
  card.appendChild(h2);
  card.appendChild(conditions);
  mainContainer.appendChild(card);
};

const generateTodaysForecastCard = (response) => {
  const card = document.createElement('div');
  card.classList.add('forecast', 'card', 'hidden');

  const h2 = document.createElement('h2');
  h2.textContent = "Today's Forecast";

  const content = document.createElement('div');
  content.classList.add('content');

  const forecastInput = [
    {
      description: 'Morning',
      hour: 7,
      day: 0,
    },
    {
      description: 'Afternoon',
      hour: 13,
      day: 0,
    },
    {
      description: 'Evening',
      hour: 19,
      day: 0,
    },
    {
      description: 'Overnight',
      hour: 1,
      day: 1,
    },
  ];

  forecastInput.forEach((input) => {
    const container = document.createElement('div');

    const description = document.createElement('p');
    description.textContent = input.description;

    const temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = `${response.forecast.forecastday[input.day].hour[input.hour].temp_c}°`;

    const img = document.createElement('img');
    img.classList.add('forecast-condition-icon');
    img.src = `http:${response.forecast.forecastday[input.day].hour[input.hour].condition.icon.replace('64x64', '128x128')}`;
    img.alt = response.forecast.forecastday[input.day].hour[input.hour].condition.text;

    const precipitation = document.createElement('div');
    precipitation.classList.add('forecast-precipitation');

    const svg = document.createElement('svg');

    const precipitationChance = document.createElement('p');
    precipitationChance.textContent = `${response.forecast.forecastday[input.day].hour[input.hour].chance_of_rain}%`;

    precipitation.appendChild(svg);
    precipitation.appendChild(precipitationChance);
    container.appendChild(description);
    container.appendChild(temp);
    container.appendChild(img);
    container.appendChild(precipitation);
    content.appendChild(container);

    svg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>water</title><path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z"></path></svg>';
  });

  card.appendChild(h2);
  card.appendChild(content);
  mainContainer.appendChild(card);
};

const generateHourlyForecastCard = (response) => {
  const card = document.createElement('div');
  card.classList.add('forecast', 'card', 'hidden');

  const h2 = document.createElement('h2');
  h2.textContent = 'Hourly Forecast';

  const content = document.createElement('div');
  content.classList.add('content');

  const button = document.createElement('button');
  button.classList.add('details-button');
  button.textContent = 'See Hourly';

  const currentHour = (new Date(response.current.last_updated)).getHours();
  const forecastInput = [];

  for (let i = 0; i < 4; i++) {
    let day = 0;
    let hour = currentHour + i;

    if (hour > 23) {
      day += 1;
      hour -= 24;
    }

    forecastInput[i] = {
      description: dateFormat(new Date(response.forecast.forecastday[day].hour[hour].time), 'p'),
      day,
      hour,
    };
  }

  forecastInput.forEach((input) => {
    const container = document.createElement('div');

    const description = document.createElement('p');
    description.textContent = input.description;

    const temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = `${response.forecast.forecastday[input.day].hour[input.hour].temp_c}°`;

    const img = document.createElement('img');
    img.classList.add('forecast-condition-icon');
    img.src = `http:${response.forecast.forecastday[input.day].hour[input.hour].condition.icon.replace('64x64', '128x128')}`;
    img.alt = response.forecast.forecastday[input.day].hour[input.hour].condition.text;

    const precipitation = document.createElement('div');
    precipitation.classList.add('forecast-precipitation');

    const svg = document.createElement('svg');

    const precipitationChance = document.createElement('p');
    precipitationChance.textContent = `${response.forecast.forecastday[input.day].hour[input.hour].chance_of_rain}%`;

    precipitation.appendChild(svg);
    precipitation.appendChild(precipitationChance);
    container.appendChild(description);
    container.appendChild(temp);
    container.appendChild(img);
    container.appendChild(precipitation);
    content.appendChild(container);

    svg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>water</title><path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z"></path></svg>';
  });

  card.appendChild(h2);
  card.appendChild(content);
  card.appendChild(button);
  mainContainer.appendChild(card);
};

const generateDailyForecastCard = (response) => {
  const card = document.createElement('div');
  card.classList.add('forecast', 'card', 'hidden');

  const h2 = document.createElement('h2');
  h2.textContent = 'Daily Forecast';

  const content = document.createElement('div');
  content.classList.add('content');

  const button = document.createElement('button');
  button.classList.add('details-button');
  button.textContent = 'See Daily';

  const forecastInput = [];

  for (let day = 0; day < 3; day++) {
    forecastInput[day] = {
      description: dateFormat(new Date(response.forecast.forecastday[day].date), 'LLLL d'),
      day,
    };
  }

  forecastInput.forEach((input) => {
    const container = document.createElement('div');

    const description = document.createElement('p');
    description.textContent = input.description;

    const temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = `${response.forecast.forecastday[input.day].day.maxtemp_c}°`;

    const span = document.createElement('span');
    span.textContent = `${response.forecast.forecastday[input.day].day.mintemp_c}°`;

    const img = document.createElement('img');
    img.classList.add('forecast-condition-icon');
    img.src = `http:${response.forecast.forecastday[input.day].day.condition.icon.replace('64x64', '128x128')}`;
    img.alt = response.forecast.forecastday[input.day].day.condition.text;

    const precipitation = document.createElement('div');
    precipitation.classList.add('forecast-precipitation');

    const svg = document.createElement('svg');

    const precipitationChance = document.createElement('p');
    precipitationChance.textContent = `${response.forecast.forecastday[input.day].day.daily_chance_of_rain}%`;

    temp.appendChild(span);
    precipitation.appendChild(svg);
    precipitation.appendChild(precipitationChance);
    container.appendChild(description);
    container.appendChild(temp);
    container.appendChild(img);
    container.appendChild(precipitation);
    content.appendChild(container);

    svg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>water</title><path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z"></path></svg>';
  });

  card.appendChild(h2);
  card.appendChild(content);
  card.appendChild(button);
  mainContainer.appendChild(card);
};

const clearCards = () => new Promise((resolve, reject) => {
  if (isInitialCardVisible) {
    fadeInHeader();
    initialCard.classList.remove('loading');
    initialCard.classList.add('fade-out');
    initialCard.addEventListener('animationend', () => {
      initialCard.classList.remove('fade-out');
      initialCard.classList.add('display-none');
      mainContainer.classList.remove('display-none');
      resolve();
    }, { once: true });
  } else {
    document
      .querySelectorAll('.main > .card:not(.header)')
      .forEach((card) => {
        card.classList.remove('loading');
        card.classList.add('fade-out');
        card.addEventListener('animationend', () => {
          card.classList.remove('fade-out');
          card.remove();
          resolve();
        }, { once: true });
      });
  }
});

const generateCards = (response) => {
  generateCurrentWeatherCard(response);
  generateTodaysConditionCard(response);
  generateTodaysForecastCard(response);
  generateHourlyForecastCard(response);
  generateDailyForecastCard(response);
  fadeInCards();
};

const search = async (e) => {
  if (e.key !== 'Enter') return;
  const searchBox = e.currentTarget;
  const query = e.currentTarget.value;
  await showCardLoadingAnimation();
  const response = await getWeather(query);
  if (Object.prototype.hasOwnProperty.call(response, 'error')) {
    console.log(response);
    searchBox.parentNode.classList.add('error');
    searchBox.addEventListener('input', () => {
      searchBox.parentNode.classList.remove('error');
    });
    cancelCardLoadingAnimation();
    searchBox.value = '';
    return;
  }
  await clearCards();
  updatePageTitle(response);
  generateCards(response);
  searchBox.value = '';
  if (isInitialCardVisible) isInitialCardVisible = false;
};

searchBoxes.forEach((searchBox) => {
  searchBox.addEventListener('keypress', search);
  searchBox.value = '';
});
