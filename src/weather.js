const key = '9e51b5dc303949fa9ae60718230908';
const days = 3;

const getWeather = async (location) => {
  const q = location;
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${q}&days=${days}`, {
    mode: 'cors',
  });
  const weather = await response.json();
  return weather;
};

export default getWeather;
