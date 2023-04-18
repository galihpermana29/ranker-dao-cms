export function imageBaseUrl(value) {
  return import.meta.env.MODE === 'development'
    ? '/dev' + value
    : import.meta.env.VITE_BASE_URL + value;
}

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    console.log(obj, item, 'assdsd');
    return {
      ...obj,
      [item[key]]: item.address,
    };
  }, initialValue);
};

export function params(data) {
  return Object.keys(data)
    .map((key) => `addresses=${encodeURIComponent(data[key])}`)
    .join('&');
}
