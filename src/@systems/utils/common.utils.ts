const getKeyEnumByValue = <T = any>(targetEnum: T, valueFind: any) => {
  return Object.keys(targetEnum)[Object.values(targetEnum).indexOf(valueFind)] || '';
};

export { getKeyEnumByValue };
