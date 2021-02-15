const fs = require('fs');
const { join } = require('path');

module.exports = {
  choosePath: (target) => {
    const path = join(__dirname, `../data/${target}.json`);

    if (!fs.existsSync(path)) {
      const folder = path.split('/').slice(0, -1).join('/');

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
      fs.writeFileSync(path, '[]');
    }

    return path;
  },
};
