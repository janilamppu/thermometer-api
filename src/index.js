const { successfulResponse, errorResponse } = require('./utils/responses');
const weatherService = require('./services/weatherService');

exports.weather = async event => {
  try {
    const response = await weatherService.getWeatherData();
    return successfulResponse(response);
  } catch (error) {
    console.log('ERROR:', error);
    return errorResponse(error);
  }
};
