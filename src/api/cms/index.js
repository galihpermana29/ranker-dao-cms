import api from '..';

function login(payload) {
  return api.post(`/login`, payload);
}

function logout() {
  return api.post(`/logout`, {});
}

async function getAllGames() {
  const {
    data: { data },
  } = await api.get('/games');
  return data;
}

async function getDetailGame(id) {
  const {
    data: { data },
  } = await api.get(`/games/${id}`);
  return data;
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

function createListingProduct(payload) {
  return api.post(`/listings`, payload);
}

function updateListingProduct(payload, listingId) {
  return api.put(`/listings/${listingId}`, payload);
}

function getListingProductByGame(query) {
  return api.get(`/listings?${query}`);
}

function getListingProductById(id) {
  return api.get(`/listings/${id}`);
}

function deleteListingProduct(id) {
  return api.delete(`/listings/${id}`);
}

function editCollection(id, payload) {
  return api.put(`/collections/${id}`, payload);
}

function deleteCollection(id) {
  return api.delete(`/collections/${id}`);
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
  deleteCollection,
  editCollection,
  createListingProduct,
  updateListingProduct,
  getListingProductByGame,
  getListingProductById,
  deleteListingProduct,
};

export default cmsAPI;
