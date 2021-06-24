import axios from "axios";

// Takes care of all the calls to our Node Api

//uploads the file+tags to back-end to trigger transaction
export const postTransaction = (data) => {
  const URL = `http://localhost:5000/upload`;
  return axios
    .post(URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

//gets an arr of id's matched
export const verifyNFTs = (data) => {
  // params: {
  //   ids: "Here are some ids to verify",
  // },
  const URL = `http://localhost:5000/verify`;
  return axios
    .post(URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
