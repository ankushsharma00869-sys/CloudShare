export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://cloudshare-backend-ny2d.onrender.com'

const apiEndPoints = {
  // 🔐 Auth (replaces Clerk sign-in/sign-up/webhooks entirely)
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
  ME: `${BASE_URL}/auth/me`,
  UPDATE_PROFILE: `${BASE_URL}/auth/me`,
  UPDATE_PROFILE_PHOTO: `${BASE_URL}/auth/me/photo`,

  FETCH_FILES: `${BASE_URL}/files/my`,
  GET_CREDITS: `${BASE_URL}/users/credits`,

  TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
  DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
  DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,

  UPLOAD_FILE: `${BASE_URL}/files/upload`,

  SEARCH_FILES: (query) => `${BASE_URL}/files/search?q=${encodeURIComponent(query)}`,

  PUBLIC_FILE_VIEW: (id) => `${BASE_URL}/files/public/${id}`,
  PUBLIC_VIEW_LINK: (id) => `${BASE_URL}/files/view/${id}`,

  CREATE_ORDER: `${BASE_URL}/payments/create-order`,
  VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
  TRANSACTIONS: `${BASE_URL}/transactions`,
};

export default apiEndPoints;
