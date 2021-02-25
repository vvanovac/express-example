const knex = require('knex');

const logger = console;
const {
  database: {
    schemas, host, username, password, dbname,
  },
} = require('../common/constants');

let connection = null;
let connecting = false;

const testConnection = () => connection
  .count()
  .from('information_schema.tables')
  .then(() => logger.log('Queried database successfully'))
  .catch((error) => logger.error('Query on database failed', error));

module.exports = {
  getConnection: async () => {
    if (!connection) {
      logger.info('Creating new database connection');
      if (!connecting) {
        connecting = true;
        const connectionData = {
          host,
          user: username,
          password,
          database: dbname,
        };

        connection = knex({
          client: 'pg',
          connection: connectionData,
          searchPath: [...schemas],
        });
        await testConnection();
        connecting = false;
      } else {
        return new Promise((resolve) => {
          const intervalID = setInterval(() => {
            if (!connecting) {
              logger.info('Database connection established after waiting');
              clearInterval(intervalID);
              resolve(connection);
            }
          }, 200);
        });
      }
    }
    logger.info('Database connection established');
    return connection;
  },
};
