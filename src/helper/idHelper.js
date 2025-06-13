// helpers/idHelper.js
// npm install uuid

const { v4: uuidv4 } = require("uuid");

function generateIdWithPrefix(prefix) {
  const shortUuid = uuidv4().split("-")[0].toUpperCase();
  return prefix + shortUuid;
}

module.exports = { generateIdWithPrefix };
