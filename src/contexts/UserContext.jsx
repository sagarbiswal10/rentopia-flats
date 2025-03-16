import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [userRentals, setUserRentals] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
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
            
            getUserProperties(storedToken);
            getUserRentals(storedToken);
          } else {
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
    
    getUserProperties(authToken);
    getUserRentals(authToken);
  };

  const logout = async () => {
    try {
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
      setUser(null);
      setToken(null);
      setUserProperties([]);
      setUserRentals([]);
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
      setUser(prevUser => ({
        ...prevUser,
        ...updatedUserData
      }));
      return updatedUserData;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }
      
      const newProperty = await response.json();
      
      setUserProperties(prev => [...prev, newProperty]);
      
      return newProperty;
    } catch (error) {
      console.error('Add property error:', error);
      throw error;
    }
  };

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add rental');
      }
      
      const newRental = await response.json();
      
      setUserRentals(prev => {
        const exists = prev.some(rental => rental._id === newRental._id);
        if (exists) {
          return prev.map(rental => 
            rental._id === newRental._id ? newRental : rental
          );
        } else {
          return [...prev, newRental];
        }
      });
      
      return newRental;
    } catch (error) {
      console.error('Add rental error:', error);
      throw error;
    }
  };

  const getUserProperties = async (currentToken = token) => {
    if (!currentToken) return [];
    
    try {
      console.log('Fetching user properties...');
      const response = await fetch('http://localhost:5000/api/properties/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user properties');
      }
      
      const properties = await response.json();
      console.log('User properties fetched:', properties.length);
      
      setUserProperties(properties);
      
      return properties;
    } catch (error) {
      console.error('Get user properties error:', error);
      return [];
    }
  };

  const getUserRentals = async (currentToken = token) => {
    if (!currentToken) return [];
    
    try {
      console.log('Fetching user rentals...');
      const response = await fetch('http://localhost:5000/api/rentals/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user rentals');
      }
      
      const rentals = await response.json();
      console.log('User rentals fetched:', rentals.length);
      
      setUserRentals(rentals);
      
      return rentals;
    } catch (error) {
      console.error('Get user rentals error:', error);
      return [];
    }
  };

  const updateRentalPaymentStatus = async (rentalId, paymentStatus, paymentId) => {
    if (!token) return null;
    
    try {
      const response = await fetch(`http://localhost:5000/api/rentals/${rentalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus, paymentId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update rental payment status');
      }
      
      const updatedRental = await response.json();
      
      setUserRentals(prev => 
        prev.map(rental => 
          rental._id === rentalId ? updatedRental : rental
        )
      );
      
      getUserProperties();
      
      return updatedRental;
    } catch (error) {
      console.error('Update rental status error:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      token,
      userProperties,
      userRentals,
      login, 
      logout, 
      updateUser,
      addProperty,
      addRental,
      getUserProperties,
      getUserRentals,
      updateRentalPaymentStatus
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
