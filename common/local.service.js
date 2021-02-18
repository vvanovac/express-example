const fs = require('fs');

const { sortComparator } = require('./common.funtions');
const requirePath = require('./path');

/*eslint-disable*/
const users = require(requirePath.choosePath('users'));
const posts = require(requirePath.choosePath('posts'));
/* eslint-enable */

const tables = { users, posts };

class Requesting {
  constructor(table) {
    this.executingTable = tables[table];
    this.table = table;
  }

  find(query = {}) {
    if (!query || Object.keys(query).length === 0) {
      return this;
    }
    this.executingTable = this.executingTable
      .filter((table) => Object.entries(query).every(([key, value]) => table[key] === value));

    return this;
  }

  findOne(id) {
    if (!id) {
      throw new Error('Bad Request');
    }

    this.executingTable = this.executingTable.find((table) => table.id === id);

    return this;
  }

  sort(criteria) {
    if (!criteria) {
      return this;
    }
    this.executingTable = this.executingTable.sort(sortComparator(criteria));

    if (criteria.startsWith('-')) {
      this.executingTable = this.executingTable.reverse();
    }
    return this;
  }

  skip(skip) {
    if (!skip) {
      return this;
    }
    const number = +skip || 0;
    this.executingTable = this.executingTable.slice(number);

    return this;
  }

  limit(limit) {
    if (!limit) {
      return this;
    }
    const number = +limit || this.executingTable.length;
    this.executingTable = this.executingTable.slice(0, number);

    return this;
  }

  select(fields) {
    if (!fields) {
      return this;
    }
    const keys = fields.split(',');

    this.executingTable = this.executingTable.map((elem) => Object.fromEntries(keys.map((key) => [key, elem[key]])));

    return this;
  }

  create(data) {
    if (this.table === 'users') {
      this.executingTable.push({ ...data, id: this.executingTable.length + 1 });

      const path = requirePath.choosePath(this.table);
      fs.writeFileSync(path, JSON.stringify(users));
    }

    if (this.table === 'posts') {
      this.executingTable.push({ ...data, id: this.executingTable.length + 1 });

      const path = requirePath.choosePath(this.table);
      fs.writeFileSync(path, JSON.stringify(posts));
    }

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
