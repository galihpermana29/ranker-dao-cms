import api from '..';

function login(payload) {
  return api.post(`/login`, payload);
}

function getAllGames() {
  return api.get('/games');
}

function getAllAdmins(params = '') {
  return api.get(`/admins?${params}`);
}

function editAdminData(payload, id) {
  return api.put(`/admins/${id}`, payload);
}

function addAdminData(payload) {
  return api.post(`/register`, payload);
}


const cmsAPI = {
  login,
  getAllGames,
  getAllAdmins,
  editAdminData,
  addAdminData,
};
export default cmsAPI;
