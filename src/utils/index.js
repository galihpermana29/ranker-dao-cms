export function imageBaseUrl(value) {
  return import.meta.env.MODE === 'development'
    ? '/dev' + value
    : import.meta.env.VITE_BASE_URL + value;
}

export const getUniqueAddress = (array) => {
  const initialValue = {};
  // let result = array.map((e) => ({ [e.address]: true }));
  array.forEach((e) => (initialValue[e.address] = true));

  return initialValue;
};

export function params(data) {
  return Object.keys(data)
    .map((key) => `addresses=${encodeURIComponent(key)}`)
    .join('&');
}

export function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}
