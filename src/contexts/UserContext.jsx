
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Add a property to the user's properties list
  const addProperty = (property) => {
    if (!user) return null;
    
    const properties = user.properties || [];
    const updatedProperties = [...properties, property];
    
    return updateUser({ properties: updatedProperties });
  };
  
  // Add a rental to the user's rentals list
  const addRental = (rental) => {
    if (!user) return null;
    
    const rentals = user.rentals || [];
    const updatedRentals = [...rentals, rental];
    
    return updateUser({ rentals: updatedRentals });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      addProperty,
      addRental
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
