module.exports = {
  port: +process.env.PORT || 3000,
  hash: process.env.JWT_HASH || 'strong-hash',
};
