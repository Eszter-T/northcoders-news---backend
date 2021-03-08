// extract any functions you are using to manipulate your data, into this file

const createRef = (list, key, value) => {
    const refObj = {};
  
    list.forEach(item=>{
      const refKey = item[key];
      const refValue = item[value];
      refObj[refKey] = refValue;
  
    });
  
    return refObj;
  };
  
  
const formatItem = (items, refObj, keyToChange, newKey) =>{
  const formattedItems = items.map(item =>{
    const formattedItem = {...item}
      formattedItem[newKey] = refObj[formattedItem[keyToChange]]
      delete formattedItem[keyToChange]
      return formattedItem
    });
    
  return formattedItems
};

module.exports = { createRef, formatItem }