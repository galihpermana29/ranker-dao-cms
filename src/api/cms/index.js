import api from '..';

function login(payload) {
  return api.post(`/login`, payload);
}

function logout() {
  return api.post(`/logout`, {});
}

function getAllGames() {
  return api.get('/games');
}

function getDetailGame(id) {
  return api.get(`/games/${id}`);
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

function forgotPasswordSendOTP(payload) {
  return api.post('/forgot-password', payload);
}

function sendingOTP(payload) {
  return api.post('/check-otp', payload);
}

function changePassword(payload) {
  return api.post('/change-password-otp', payload);
}

function createCollection(payload) {
  return api.post(`/collections`, payload);
}

function getCollection(params) {
  return api.get(`/collections?${params}`);
}

function getDetailAdmin(id) {
  return api.get(`/admins/${id}`);
}

const cmsAPI = {
  addAdminData,
  changePassword,
  createCollection,
  editAdminData,
  getDetailAdmin,
  forgotPasswordSendOTP,
  getAllAdmins,
  getAllGames,
  getDetailGame,
  getCollection,
  login,
  logout,
  sendingOTP,
};
export default cmsAPI;
