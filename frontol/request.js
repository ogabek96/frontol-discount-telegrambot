const cache = require('memory-cache');
const axios = require('axios');
const { credentialsToBase64, objectToBase64 } = require('./helpers/base64');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const getTokenObject = async () => {
  try {
    const request = await axios.get(`${process.env.FRONTOL_URL}/token`, {
      headers: {
        Authorization: `Direct ${credentialsToBase64(process.env.FRONTOL_USERNAME, process.env.FRONTOL_PASSWORD)}`,
      },
    });
    return request.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const request = axios.create({
  baseURL: process.env.FRONTOL_URL,
  timeout: 5000,
});

request.interceptors.request.use(
  async (config) => {
    const newConfing = config;
    let token = cache.get('token');
    if (!token) {
      const tokenRequest = objectToBase64(await getTokenObject());
      if (tokenRequest) {
        cache.put('token', tokenRequest, 1000 * 60 * 45);
        token = tokenRequest;
      }
    }
    newConfing.headers.Authorization = `Bearer ${token}`;
    return newConfing;
  },
  (error) => {
    console.error(error);
    Promise.reject(error);
  },
);

module.exports = request;
