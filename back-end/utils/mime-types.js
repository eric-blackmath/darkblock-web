var dict = {};

dict[".aac"] = "audio/aac";
dict[".abw"] = "application/x-abiword";
dict[".arc"] = "application/x-freearc";
dict[".avi"] = "video/x-msvideo";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";
dict[""] = "";

const getMimeTypeForExt = (ext) => {
  return dict[ext];
};

module.exports = {
  getMimeTypeForExt,
};
