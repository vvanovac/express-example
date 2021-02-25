let connection = null;

class Requesting {
  constructor(table) {
    this.executingFunction = {};
    this.table = table;
  }

  static setConnection(databaseConnection) {
    connection = databaseConnection;
    return connection;
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

    this.executingFunction.select = fields.split(',');

    return this;
  }

  join(table, pk, fk) { // pk = primary key; fk = foreign key
    this.executingFunction.join = { table, pk, fk };

    return this;
  }

  create(data) {
    return connection
      .insert(data)
      .into(this.table);
  }

  delete(id) {
    return connection(this.table)
      .where({ id })
      .del();
  }

  update(id, data) {
    return connection(this.table)
      .update(data)
      .where({ id });
  }

  async exec() {
    const con = connection
      .select(this.executingFunction.select || '*')
      .from(this.table);

    // find
    if (this.executingFunction.function) {
      con.where(this.executingFunction.query);
    }

    // sort
    if (this.executingFunction.sort) {
      if (this.executingFunction.sort.startsWith('-')) {
        this.executingFunction.sort = this.executingFunction.sort.slice(1);
        con.orderBy(this.executingFunction.sort, 'desc');
      }
      con.orderBy(this.executingFunction.sort);
    }

    // skip and limit
    if (this.executingFunction.limit || this.executingFunction.skip) {
      con.limit(this.executingFunction.limit).offset(this.executingFunction.skip);
    }

    if (this.executingFunction.join) {
      con.innerJoin(this.executingFunction.join.table,
        `${this.table}.${this.executingFunction.join.fk}`,
        `${this.executingFunction.join.table}.${this.executingFunction.join.pk}`);
    }

    return con.then((values) => {
      if (this.executingFunction.function === 'find') {
        return values[0];
      }
      return values;
    });
  }
}

module.exports = Requesting;
