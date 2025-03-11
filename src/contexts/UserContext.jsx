
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in by validating the token
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Validate token with the backend
          const response = await fetch('http://localhost:5000/api/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token is invalid, remove from storage
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if needed
      if (token) {
        await fetch('http://localhost:5000/api/users/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Regardless of API response, clear local state
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const updateUser = async (newUserData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUserData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      
      const updatedUserData = await response.json();
      setUser(updatedUserData);
      return updatedUserData;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Add a property to the user's properties list
  const addProperty = async (propertyData) => {
    if (!user || !token) return null;
    
    try {
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add property');
      }
      
      const newProperty = await response.json();
      
      // Update local user state with the new property
      setUser(prevUser => ({
        ...prevUser,
        properties: [...(prevUser.properties || []), newProperty],
      }));
      
      return newProperty;
    } catch (error) {
      console.error('Add property error:', error);
      throw error;
    }
  };
  
  // Add a rental to the user's rentals list
  const addRental = async (rentalData) => {
    if (!user || !token) return null;
    
    try {
      const response = await fetch('http://localhost:5000/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(rentalData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add rental');
      }
      
      const newRental = await response.json();
      
      // Update local user state with the new rental
      setUser(prevUser => ({
        ...prevUser,
        rentals: [...(prevUser.rentals || []), newRental],
      }));
      
      return newRental;
    } catch (error) {
      console.error('Add rental error:', error);
      throw error;
    }
  };
  
  // Get user's properties
  const getUserProperties = async () => {
    if (!user || !token) return [];
    
    try {
      const response = await fetch('http://localhost:5000/api/properties/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user properties');
      }
      
      const properties = await response.json();
      
      // Update user's properties in state
      setUser(prevUser => ({
        ...prevUser,
        properties,
      }));
      
      return properties;
    } catch (error) {
      console.error('Get user properties error:', error);
      return [];
    }
  };
  
  // Get user's rentals
  const getUserRentals = async () => {
    if (!user || !token) return [];
    
    try {
      const response = await fetch('http://localhost:5000/api/rentals/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user rentals');
      }
      
      const rentals = await response.json();
      
      // Update user's rentals in state
      setUser(prevUser => ({
        ...prevUser,
        rentals,
      }));
      
      return rentals;
    } catch (error) {
      console.error('Get user rentals error:', error);
      return [];
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      token,
      login, 
      logout, 
      updateUser,
      addProperty,
      addRental,
      getUserProperties,
      getUserRentals
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
