

const changeTimeStamp = (array, key) => {
  return array.map((obj) => {
    const copyObj = { ...obj };
    copyObj[key] = new Date(copyObj[key]);
    return copyObj;
  });
};

const createRefObj = (array, key, value) => {
  const refObj = {};

  array.forEach((obj) => {
    const refObjKey = obj[key];
    const refObjValue = obj[value];
    refObj[refObjKey] = refObjValue;
  });

  return refObj;
};
const switchKeyRef = (array, refObject, keyToReplace, newKey) => {
  const newArr = array.map((object) => {
    const newObj = { ...object };
    newObj[newKey] = refObject[object[keyToReplace]];
    delete newObj[keyToReplace];
    return newObj;
  });

  return newArr;
};

module.exports = { changeTimeStamp, createRefObj, switchKeyRef };
