const { Base64 } = require('js-base64');
const crypto = require('crypto');

const credentialsToBase64 = (username, password) => {
  try {
    const passwordHash = crypto.createHash('md5').update(`${username}:${password}`).digest('hex');
    const obj = {
      id: username,
      password: passwordHash,
    };
    return Base64.encode(JSON.stringify(obj));
  } catch (e) {
    console.error(e);
    return null;
  }
};

const objectToBase64 = (obj) => {
  try {
    return Base64.encode(JSON.stringify(obj));
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  credentialsToBase64,
  objectToBase64,
};
