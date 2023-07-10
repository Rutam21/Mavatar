const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');
  return secretKey;
};

// Usage
const secretKey = generateSecretKey();
console.log('Secret Key:', secretKey);
