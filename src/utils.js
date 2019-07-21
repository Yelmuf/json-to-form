export const printJSON = obj =>
  JSON.stringify(obj, null, 2);

export const formatJSON = (unformattedText = '') => {
  const obj = JSON.parse(unformattedText);
  return printJSON(obj);
};

export const withDefault = defaultValue => value => value || defaultValue;
