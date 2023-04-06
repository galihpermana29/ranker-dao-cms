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

function forgotPasswordSendOTP(payload) {
  return api.post('/forgot-password', payload);
}

function sendingOTP(payload) {
  return api.post('/check-otp', payload);
}

function changePassword(payload) {
  return api.post('/change-password-otp', payload);
}
const cmsAPI = {
  addAdminData,
  changePassword,
  editAdminData,
  forgotPasswordSendOTP,
  getAllAdmins,
  getAllGames,
  login,
  sendingOTP,
};
export default cmsAPI;
