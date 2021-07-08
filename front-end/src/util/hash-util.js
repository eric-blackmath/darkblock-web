import CryptoJS from "crypto-js";

export function hashInChunks(file) {
  var SHA256 = CryptoJS.algo.SHA256.create();
  var counter = 0;
  var self = this;

  return new Promise((resolve, reject) => {
    loading(
      file,
      function (data) {
        var wordBuffer = CryptoJS.lib.WordArray.create(data);
        SHA256.update(wordBuffer);
        counter += data.byteLength;
        console.log(((counter / file.size) * 100).toFixed(0) + "%");
      },
      function (data) {
        console.log("100%");
        var encrypted = SHA256.finalize().toString();
        resolve(encrypted);
        console.log("encrypted: " + encrypted);
      }
    );
  });
}

function loading(file, callbackProgress, callbackFinal) {
  var chunkSize = 1024 * 1024; // bytes - increasing chunkSize takes more memory, decreasing it takes more time
  var offset = 0;
  var size = chunkSize;
  var partial;
  var index = 0;

  if (file.size === 0) {
    callbackFinal();
  }
  while (offset < file.size) {
    partial = file.slice(offset, offset + size);
    var reader = new FileReader();
    reader.size = chunkSize;
    reader.offset = offset;
    reader.index = index;
    reader.onload = function (evt) {
      callbackRead(this, file, evt, callbackProgress, callbackFinal);
    };
    reader.readAsArrayBuffer(partial);
    offset += chunkSize;
    index += 1;
  }
}

function callbackRead(reader, file, evt, callbackProgress, callbackFinal) {
  callbackProgress(evt.target.result);
  if (reader.offset + reader.size >= file.size) {
    callbackFinal();
  }
}
