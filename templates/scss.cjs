// Bem-Create template for creating *.scss files

const { EOL } = require('os');

// eslint-disable-next-line func-names
module.exports = function (entity, naming) {
  return [`.${naming.stringify(entity)} {\n\t`, '}\n'].join(EOL);
};