const sortComparator = (reqQuery) => (data1, data2) => {
  const key = reqQuery.replace(/^-/, '');
  if (typeof (data1[key]) === 'string') {
    return data1[key].localeCompare(data2[key]);
  }
  if (typeof (data1[key]) === 'number') {
    return data1[key] - data2[key];
  }
  return 0;
};

const fieldsFilter = (data, query = '') => {
  if (!query) {
    return data;
  }
  const keys = query.split(',');

  return Object.fromEntries(keys.map((key) => [key, data[key]]));
};

module.exports = {
  sortComparator,
  fieldsFilter,
  reqFilter: (data, query) => {
    const {
      skip, limit, sort, fields,
    } = query || {};
    let copy = JSON.parse(JSON.stringify(data));
    const skipNum = +skip || 0;
    const limitNum = +limit || copy.length;

    if (sort) {
      copy.sort(sortComparator(sort));
      if (sort.startsWith('-')) {
        copy.reverse();
      }
    }
    if (skipNum || limitNum) {
      copy = copy.slice(skipNum, skipNum + limitNum);
    }

    return copy.map((e) => fieldsFilter(e, fields));
  },
};
