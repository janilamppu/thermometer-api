const axios = require('axios');
const apiURL = 'https://api.openweathermap.org/data/2.5/weather/';
const moment = require('moment');
const { weatherDescriptions } = require('../utils/weatherInfo');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

exports.getWeatherData = async function () {
  // get appId from SSM
  const settingsParam = await ssm
    .getParameter({ Name: 'weatherapp-settings' })
    .promise();
  // settings param is defined as [appid,city,units]
  const settings = parseParams(settingsParam);
  const requestParams = {
    q: `${settings.city},FI`,
    appid: settings.appId,
    units: settings.units,
  };
  let url = addQueryParamsToUrl(apiURL, requestParams);
  let response = await axios.get(url);
  return formResponse(response.data);
};

const parseParams = rawParams => {
  const params = rawParams.Parameter.Value.split(',');
  return {
    appId: params[0],
    city: params[1],
    units: params[2],
  };
};

const formResponse = rawResponse => {
  return {
    description: getWeatherDescription(rawResponse.weather[0].main),
    icon: rawResponse.weather[0].icon,
    temperature: Math.round(rawResponse.main.temp),
    humidity: rawResponse.main.humidity,
    windSpeed: rawResponse.wind.speed.toFixed(1),
    sunrise: moment.unix(rawResponse.sys.sunrise).toISOString(),
    sunset: moment.unix(rawResponse.sys.sunset).toISOString(),
  };
};

const getWeatherDescription = desc => {
  if (!weatherDescriptions[desc]) {
    console.log(`${desc} is missing from weather translations!`);
    return 'Ei tiedossa';
  } else {
    return weatherDescriptions[desc];
  }
};

const addQueryParamsToUrl = (url, params) => {
  Object.keys(params).forEach((param, index) => {
    url += (index == 0 ? '?' : '&') + param + '=' + params[param];
  });
  return url;
};
