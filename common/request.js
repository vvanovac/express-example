const fetch = require('node-fetch');

const baseUrl = 'https://jsonplaceholder.typicode.com';

const getJSON = (req) => req.json();

module.exports = {
  get: (url) => fetch(`${baseUrl}${url}`).then(getJSON),
  post: (url, body) => fetch(`${baseUrl}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(getJSON),
  put: (url, body) => fetch(`${baseUrl}${url}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(getJSON),
  delete: (url) => fetch(`${baseUrl}${url}`, { method: 'DELETE' }).then(getJSON),
};
