const fs = require("fs");

function prepareFileForEncryption(aesKey, file) {
  let pack = {};
  pack["aesKey"] = aesKey;
  pack["filename"] = file.path;
  console.log("writing file");
  fs.writeFileSync(file.path + ".ready", JSON.stringify(pack));
}

function checkForEncryptedFile(path) {
  return new Promise((resolve, reject) => {
    const intervalObj = setInterval(function () {
      const file = path;
      const fileExists = fs.existsSync(file);

      console.log("Checking for: ", file);

      if (fileExists) {
        clearInterval(intervalObj);
        resolve(true);
      }
    }, 1000);
  });
}

module.exports = {
  prepareFileForEncryption,
  checkForEncryptedFile,
};
