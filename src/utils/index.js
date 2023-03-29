export function imageBaseUrl(value) {
  return import.meta.env.MODE === 'development'
    ? '/dev' + value
    : import.meta.env.VITE_BASE_URL + value;
}
