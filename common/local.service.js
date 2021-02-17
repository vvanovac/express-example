const fs = require('fs');

const { sortComparator } = require('./common.funtions');
const requirePath = require('./path');

const users = require(requirePath.choosePath('users'));
const posts = require(requirePath.choosePath('posts'));

const tables = { users, posts };

class Requesting {
  constructor(table) {
    this.executingTable = tables[table];
  }

  find(query = {}) {
    this.executingTable = this.executingTable
      .filter((table) => Object.entries(query).every(([key, value]) => table[key] === value));

    return this;
  }

  findOne(id) {
    if (!id) {
      throw new Error('Bad Request');
    }

    this.executingTable = this.executingTable.find((table) => table.id === id);

    if (!this.executingTable) {
      throw new Error('Not Found');
    }

    return this;
  }

  sort(criteria) {
    if (!criteria) {
      throw new Error('Bad Request');
    }
    this.executingTable = this.executingTable.sort(sortComparator(criteria));

    if (criteria.startsWith('-')) {
      this.executingTable = this.executingTable.reverse();
    }
    return this;
  }

  skip(skip) {
    const number = +skip || 0;
    this.executingTable = this.executingTable.slice(number);

    return this;
  }

  limit(limit) {
    const number = +limit || this.executingTable.length;
    this.executingTable = this.executingTable.slice(0, number);

    return this;
  }

  create(data) {
    const { username, email } = data;

    const userExists = this.executingTable.find((exist) => exist.username === username || exist.email === email);
    if (userExists) {
      throw new Error('User already exists.');
    }

    this.executingTable.push({ ...data, id: this.executingTable.length + 1 });

    const path = requirePath.choosePath('users');
    fs.writeFileSync(path, JSON.stringify(users));

    return this;
  }

  delete(id) {
    this.executingTable = this.executingTable.filter((table) => table.id !== id);

    return this;
  }

  update(id, data) {
    this.executingTable = this.executingTable.map((table) => {
      if (table.id === id) {
        return data;
      }
      return table;
    });
    return this;
  }

  async exec() {
    return this.executingTable;
  }
}

module.exports = Requesting;
