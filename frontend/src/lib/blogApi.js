import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const TOKEN_KEY = "vh_admin_token";

export const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API}/blog/image/${path}`;
};

const authHeaders = () => {
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const blogApi = {
  list: async () => (await axios.get(`${API}/blog/posts`)).data,
  get: async (slug) => (await axios.get(`${API}/blog/posts/${slug}`)).data,
  login: async (email, password) => (await axios.post(`${API}/auth/login`, { email, password })).data,
  me: async () => (await axios.get(`${API}/auth/me`, { headers: authHeaders() })).data,
  adminList: async () => (await axios.get(`${API}/blog/admin/posts`, { headers: authHeaders() })).data,
  adminGet: async (id) => (await axios.get(`${API}/blog/admin/posts/${id}`, { headers: authHeaders() })).data,
  create: async (data) => (await axios.post(`${API}/blog/posts`, data, { headers: authHeaders() })).data,
  update: async (id, data) => (await axios.put(`${API}/blog/posts/${id}`, data, { headers: authHeaders() })).data,
  remove: async (id) => (await axios.delete(`${API}/blog/posts/${id}`, { headers: authHeaders() })).data,
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return (await axios.post(`${API}/blog/upload-image`, fd, { headers: authHeaders() })).data;
  },
};

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  if (detail?.msg) return detail.msg;
  return String(detail);
}
