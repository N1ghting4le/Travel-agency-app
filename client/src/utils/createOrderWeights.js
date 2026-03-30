export const createOrderWeights = (arr, valueField) =>
  arr.reduce((weights, item, index) => {
    weights[item[valueField]] = index;

    return weights;
  }, {});
