const path = require('path');
// Used to mock svg images
module.exports = {
  process(filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`
    };
  }
};
