const Store = window.require("electron-store");

const store = new Store();

const getDataFromStore = (key) => {
  let data = store.get(key);
  //   console.log(data);
  return data;
};

const setDataInStore = (key, value) => {
  store.set(key, value);
};

module.exports = {
  getDataFromStore,
  setDataInStore,
};
