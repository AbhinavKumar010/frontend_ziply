import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-ziply.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Product APIs
export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getVendorProducts: () => api.get('/products/vendor'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => {
    try {
      const formData = new FormData();
      
      // Log the incoming data for debugging
      console.log('Creating product with data:', productData);
      
      // Append product details
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          // Handle multiple images
          if (Array.isArray(productData[key])) {
            productData[key].forEach((image, index) => {
              if (image instanceof File) {
                formData.append('images', image);
              } else if (typeof image === 'string') {
                // If it's a URL string, we might want to handle it differently
                formData.append('imageUrls', image);
              }
            });
          }
        } else if (key !== 'imageFiles') { // Skip imageFiles as we handle it separately
          formData.append(key, productData[key]);
        }
      });

      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      return api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },
  updateProduct: (id, productData) => {
    try {
      const formData = new FormData();
      
      // Log the incoming data for debugging
      console.log('Updating product with data:', productData);
      
      // Append product details
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          // Handle multiple images
          if (Array.isArray(productData[key])) {
            productData[key].forEach((image, index) => {
              if (image instanceof File) {
                formData.append('images', image);
              } else if (typeof image === 'string') {
                // If it's a URL string, we might want to handle it differently
                formData.append('imageUrls', image);
              }
            });
          }
        } else if (key !== 'imageFiles') { // Skip imageFiles as we handle it separately
          formData.append(key, productData[key]);
        }
      });

      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      return api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addRating: (id, ratingData) => api.post(`/products/${id}/ratings`, ratingData),
  getTrendingProducts: () => api.get('/products/trending'),
  getRecommendations: () => api.get('/products/recommendations'),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
};

// Order APIs
export const orderAPI = {
  getAllOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getLiveOrders: () => api.get('/orders/live'),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  getOrderHistory: () => api.get('/orders/history'),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  deactivateUser: (id) => api.patch(`/users/${id}/deactivate`),
};

export const socketService = {
  socket: null,
  connect: () => {
    try {
      const token = localStorage.getItem('token');
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
      if (!wsUrl) {
        console.error('WebSocket URL is not defined');
        return;
      }
      socketService.socket = new WebSocket(`${wsUrl}?token=${token}`);
      
      socketService.socket.onopen = () => {
        console.log('Socket connected successfully');
      };

      socketService.socket.onerror = (error) => {
        console.error('Socket error:', error);
      };

      socketService.socket.onclose = () => {
        console.log('Socket disconnected');
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  },
  disconnect: () => {
    if (socketService.socket) {
      socketService.socket.close();
      socketService.socket = null;
    }
  },
  subscribe: (event, callback) => {
    if (socketService.socket) {
      socketService.socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === event) {
            callback(data.payload);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
    }
  },
};

export default api; 