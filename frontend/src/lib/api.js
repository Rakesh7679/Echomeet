import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const config = {};
  
  // If userData is FormData (contains file upload), set proper headers
  if (userData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }
  
  const response = await axiosInstance.post("/auth/onboarding", userData, config);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  try {
    console.log("Calling getFriendRequests API...");
    console.log("Current cookies:", document.cookie);
    const response = await axiosInstance.get("/users/friend-requests");
    console.log("getFriendRequests response:", response.data);
    return response.data;
  } catch (error) {
    console.error("getFriendRequests error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function searchFriends(query) {
  const response = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);
  return response.data;
}
