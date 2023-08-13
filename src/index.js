import './style.css';
import getWeather from './weather';

getWeather()
  .then(
    (value) => {
      console.log(value);
    },
    (error) => {
      console.error(error);
    },
  );
