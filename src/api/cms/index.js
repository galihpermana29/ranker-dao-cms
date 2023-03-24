import api from '..';

function login(payload) {
  return api.post(`/login`, payload);
}

function getAllGames() {
  return api.get('/games');
}

const cmsAPI = { login, getAllGames };
export default cmsAPI;
