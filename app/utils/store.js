'use strict';

import { AsyncStorage } from 'react-native';

function clear() {
  return AsyncStorage.clear();
}

function get(key) {
  return AsyncStorage.getItem(key).then(value => JSON.parse(value));
}

function set(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

function remove(key) {
  return AsyncStorage.removeItem(key);
}

function multiGet(...keys) {
  return AsyncStorage.multiGet([...keys]).then((stores) => {
    let data = {};
    stores.map((result, i, store) => {
      data[store[i][0]] = JSON.parse(store[i][1]);
    });
    return data;
  });
}

function multiRemove(...keys) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
};
