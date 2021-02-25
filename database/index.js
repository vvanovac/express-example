const database = require('./database.service');
const localService = require('../common/local.service');

module.exports = class DatabaseInit {
  static async init() {
    const databaseConnection = await database.getConnection();
    localService.setConnection(databaseConnection);

    return true;
  }
};
