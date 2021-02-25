const pgSchema = process.env.DB_SCHEMA || 'public';

module.exports = {
  port: +process.env.PORT || 3000,
  hash: process.env.JWT_HASH || 'strong-hash',
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    dbname: process.env.DB_NAME || 'postgres',
    schemas: [pgSchema],
  },
};
