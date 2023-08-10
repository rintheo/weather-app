import './style.css';
import getWeather from './weather';

const location = 'cebu';
const body = document.querySelector('body');

getWeather()
  .then(
    (value) => {
      console.log(value);

      const img = new Image();
      img.src = `http:${value.current.condition.icon}`;

      body.appendChild(img);
    },
    (error) => {
      console.error(error);
    },
  );
