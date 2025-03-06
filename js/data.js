let USER = [];
let CONTRACTORS = [];

const saveUserData = (data, cb) => {
  USER = data;
  cb(data);
};

const getUser = () => USER;

const saveContractorsData = (data, cb) => {
  CONTRACTORS = data;
  cb(data);
};

const getContractors = () => CONTRACTORS;

export {
  saveUserData,
  saveContractorsData,
  getUser,
  getContractors,
};
