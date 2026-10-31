// src/api/roomieApi.js
import client from './client';

export const authApi = {
  login: (email, password) => client.post('/auth/login', { email, password }),
  register: (name, email, password) => client.post('/auth/register', { name, email, password }),
};

export const userApi = {
  getProfile: () => client.get('/users/me'),
  searchUsers: (query) => client.get(`/users/search?query=${encodeURIComponent(query)}`),
  getIdleUsers: () => client.get('/users/idle'),
  getUsersAvailableForRoom: (roomId) => client.get(`/users/available-for-room/${roomId}`),
};

export const roomApi = {
  getUserRooms: () => client.get('/rooms'),
  getRoomDetails: (roomId) => client.get(`/rooms/${roomId}`),
  createRoom: (name = 'My Room', invitedMemberIds = []) => client.post('/rooms', { name: name || 'My Room', invitedMemberIds }),
  addMemberDirectly: (roomId, userId) => client.post(`/rooms/${roomId}/members`, { userId }),
};

export const invitationApi = {
  getPendingInvitations: () => client.get('/invitations'),
  sendInvitation: (roomId, userId) => client.post(`/invitations/rooms/${roomId}`, { userId }),
  acceptInvitation: (invitationId) => client.post(`/invitations/${invitationId}/accept`),
  rejectInvitation: (invitationId) => client.post(`/invitations/${invitationId}/reject`),
};

export const expenseApi = {
  getExpenses: (roomId, page = 0, size = 20) => client.get(`/rooms/${roomId}/expenses?page=${page}&size=${size}`),
  getAllExpenses: (roomId) => client.get(`/rooms/${roomId}/expenses/all`),
  createExpense: (roomId, expenseData) => client.post(`/rooms/${roomId}/expenses`, expenseData),
  getBalances: (roomId) => client.get(`/rooms/${roomId}/balances`),
  getAnalytics: (roomId) => client.get(`/rooms/${roomId}/analytics`),
};

export const settlementApi = {
  recordPayment: (roomId, roommateId, amount, notes = '') =>
    client.post(`/rooms/${roomId}/payments`, { roommateId, amount, notes }),
  getPaymentHistory: (roomId) => client.get(`/rooms/${roomId}/payments`),
  getSimplifiedDebts: (roomId) => client.get(`/rooms/${roomId}/settlements/simplified`),
};

