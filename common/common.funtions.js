const sortComparator = (reqQuery) => (data1, data2) => {
    const key = reqQuery.replace(/^-/, '');
    if (typeof (data1[key]) === "string") {
        return data1[key].localeCompare(data2[key]);
    } else if (typeof (data1[key]) === "number") {
        return data1[key] - data2[key];
    }
    return 0;
}

const fieldsFilter = (data, query = '') => {
    if (!query) {
        return data;
    }
    const keys = query.split(',');

    return Object.assign({}, ...keys.map(key => {
        return {
            [key]:data[key]
        }
    }))
}

module.exports = {
    sortComparator,
    fieldsFilter,
    reqFilter: (data, query) => {
        let copy = JSON.parse(JSON.stringify(data));
        const skipNum = +query.skip || 0;
        const limitNum = +query.limit || copy.length;

        if (query.sort) {
            copy.sort(sortComparator(query.sort));
            if (query.sort.startsWith('-')) {
                copy.reverse();
            }
        }
        if (skipNum || limitNum) {
            copy = copy.slice(skipNum, skipNum + limitNum);
        }

        return copy.map((e) => fieldsFilter(e, query.fields))
    }
}
