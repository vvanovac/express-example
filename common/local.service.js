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
    this.executingFunction = {};
    this.table = table;
  }

  find(query = {}) {
    if (!query || Object.keys(query).length === 0) {
      return this;
    }

    this.executingFunction.query = query;
    this.executingFunction.function = 'filter';

    return this;
  }

  findOne(id) {
    if (!id) {
      throw new Error('Bad Request');
    }

    this.executingFunction.query = { id };
    this.executingFunction.function = 'find';

    return this;
  }

  sort(criteria) {
    if (!criteria) {
      return this;
    }

    this.executingFunction.sort = criteria;

    return this;
  }

  skip(skip) {
    if (!skip) {
      return this;
    }

    this.executingFunction.skip = skip;

    return this;
  }

  limit(limit) {
    if (!limit) {
      return this;
    }

    this.executingFunction.limit = limit;

    return this;
  }

  select(fields) {
    if (!fields) {
      return this;
    }

    this.executingFunction.select = fields;

    return this;
  }

  create(data) {
    const table = tables[this.table];
    table.push({ ...data, id: table.length + 1 });

    const path = requirePath.choosePath(this.table);
    fs.writeFileSync(path, JSON.stringify(table));

    return this;
  }

  delete(id) {
    const newTableData = tables[this.table].filter((table) => table.id !== id);
    tables[this.table] = newTableData;

    const path = requirePath.choosePath(this.table);
    fs.writeFileSync(path, JSON.stringify(newTableData));

    return this;
  }

  update(id, data) {
    tables[this.table] = tables[this.table].map((table) => {
      if (table.id === id) {
        return data;
      }
      return table;
    });
    return this;
  }

  async exec() {
    let table = JSON.parse(JSON.stringify(tables[this.table]));

    // find
    if (this.executingFunction.function) {
      table = table[this.executingFunction.function]((tab) => Object.entries(this.executingFunction.query)
        .every(([key, value]) => tab[key] === value));
    }
    // sort
    if (this.executingFunction.sort) {
      table = table.sort(sortComparator(this.executingFunction.sort));

      if (this.executingFunction.sort.startsWith('-')) {
        table = table.reverse();
      }
    }
    // skip and limit
    if (this.executingFunction.limit || this.executingFunction.skip) {
      const skipNum = +this.executingFunction.skip || 0;
      const limitNum = +this.executingFunction.limit || table.length;

      table = table.slice(skipNum, skipNum + limitNum);
    }
    // select
    if (this.executingFunction.select) {
      const keys = this.executingFunction.select.split(',');

      table = table.map((elem) => Object.fromEntries(keys.map((key) => [key, elem[key]])));
    }

    return table;
  }
}

module.exports = Requesting;
