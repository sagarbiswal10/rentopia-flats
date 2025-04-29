
// API configuration for the application

// By default, use the deployed backend URL
let API_URL = 'https://rentopia-backend.onrender.com';

// Check if we're in a development environment and use localhost if needed
// Uncomment this line to use local development server
// API_URL = 'http://localhost:5000';

// Add a helper function for API requests with better error handling
export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    console.log(`Attempting to fetch from: ${API_URL}${url}`);
    const response = await fetch(`${API_URL}${url}`, options);
    
    if (!response.ok) {
      // Try to get error details from response
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! Status: ${response.status}`
      }));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    
    // Provide more user-friendly error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to the server. Please check your internet connection or if the backend server is running.');
    }
    
    if (error.message.includes('404')) {
      throw new Error('API endpoint not found. Please check if the backend server is running and configured correctly.');
    }
    
    throw error;
  }
};

// Export a function to check if the API is accessible
export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

export default API_URL;
