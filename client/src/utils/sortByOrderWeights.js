export const sortByOrderWeights = (arr, orderWeights) =>
  arr.sort((a, b) => orderWeights[a] - orderWeights[b]);
