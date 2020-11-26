module.exports.successfulResponse = function (payload, contentType) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': contentType || 'application/json',
    },
    body: JSON.stringify(payload),
  };
};

module.exports.errorResponse = function (payload, contentType) {
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': contentType || 'application/json',
    },
    body: JSON.stringify(payload),
  };
};
