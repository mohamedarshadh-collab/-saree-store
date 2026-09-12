import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export const getProducts = (params) => api.get("/products", { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get("/products/categories");

export const getOrders = (phone) => api.get("/orders", { params: { phone } });
export const getOrder = (id) => api.get(`/orders/${id}`);

export const createRazorpayOrder = (payload) => api.post("/payment/create-order", payload);
export const verifyPayment = (payload) => api.post("/payment/verify", payload);

export const getTracking = (orderId) => api.get(`/tracking/${orderId}`);
export const getReviews = (productId) => api.get(`/reviews/${productId}`);
export const submitReview = (productId, payload) => api.post(`/reviews/${productId}`, payload);

export default api;
