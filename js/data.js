const saveUserData = (data, cb) => {
  sessionStorage.user = JSON.stringify(data);

  cb(JSON.parse(sessionStorage.user));
};

const saveContractorsData = (data, cb) => {
  sessionStorage.contractors = JSON.stringify(data);

  cb(JSON.parse(sessionStorage.contractors));
};

const getUser = () => JSON.parse(sessionStorage.user);
const getContractors = () => JSON.parse(sessionStorage.contractors);

export {
  saveUserData,
  saveContractorsData,
  getUser,
  getContractors,
};
