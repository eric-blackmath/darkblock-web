const { v4: uuidv4 } = require("uuid");

const generateArtId = () => {
  return uuidv4();
};
module.exports = {
  generateArtId,
};
