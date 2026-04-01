import request from "./request";
import { apiClient } from "./axiosClient";

const apiUser = "/api/user";

export const requestLogin = async (data: unknown) => {
  const res = await request.post(`${apiUser}/login`, data);
  return res.data;
};

export const requestLoginGoogle = async (credential: string) => {
  const res = await request.post(`${apiUser}/login-google`, {
    credential,
  });
  return res.data;
};

export const requestRegister = async (data: unknown) => {
  const res = await request.post(`${apiUser}/register`, data);
  return res.data;
};

export const requestLogout = async () => {
  const res = await request.get(`${apiUser}/logout`);
  return res.data;
};

export const requestAuth = async () => {
  const res = await apiClient.get(`${apiUser}/auth`);
  return res.data;
};

export const requestRefreshToken = async () => {
  const res = await request.get(`${apiUser}/refresh-token`);
  return res.data;
};

export const requestForgotPassword = async (data: unknown) => {
  const res = await request.post(`${apiUser}/forgot-password`, data);
  return res.data;
};

export const requestVerifyForgotPassword = async (data: unknown) => {
  const res = await request.post(`${apiUser}/verify-forgot-password`, data);
  return res.data;
};

// --- Phân quyền: Admin quản lý users, User xem/sửa bản thân ---
export const requestGetAllUsers = async () => {
  const res = await apiClient.get(apiUser);
  return res.data;
};

export const requestGetUserById = async (id: string) => {
  const res = await apiClient.get(`${apiUser}/${id}`);
  return res.data;
};

export const requestCreateUser = async (data: unknown) => {
  const res = await apiClient.post(apiUser, data);
  return res.data;
};

export const requestUpdateUser = async (id: string, data: unknown) => {
  const res = await apiClient.put(`${apiUser}/${id}`, data);
  return res.data;
};

export const requestDeleteUser = async (id: string) => {
  const res = await apiClient.delete(`${apiUser}/${id}`);
  return res.data;
};
