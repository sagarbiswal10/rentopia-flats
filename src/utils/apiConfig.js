
// API configuration for the application
// Change this to your deployed API URL when deploying
const API_URL = 'https://rentopia-backend.onrender.com'; // Ensure this matches your deployed backend URL

// For local development, uncomment this line:
// const API_URL = 'http://localhost:5000';

// Add a helper function for API requests with better error handling
export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${url}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! Status: ${response.status}`
      }));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

export default API_URL;
