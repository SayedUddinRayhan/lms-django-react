import API from "../api/apiClient";

export const authService = {
  login: async ({ username, password }) => {
    const res = await API.post("auth/login/", { username, password });
    const { access, refresh, user } = res.data;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    return user; 
  },

  register: async (userData) => {
    const res = await API.post("auth/register/", userData);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await API.get("auth/me/");
    return res.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("No refresh token available");
    const res = await API.post("/auth/token/refresh/", { refresh });
    localStorage.setItem("access", res.data.access);
    return res.data.access;
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  },
};