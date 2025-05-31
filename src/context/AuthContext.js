"use client"

import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in from localStorage or session
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)

    // In a real app, you would verify the token with your backend
    // Example:
    /*
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error verifying token:', error);
        setLoading(false);
      }
    };
    
    verifyToken();
    */
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await fetch('http://localhost:9090/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed invalid credentials');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      // For demo purposes
      // In a real app, you would make an API call to your backend

      /* 
      // Real implementation would look like:
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      return data;
      */

      // Dummy registration logic
      return { success: true, message: "Registration successful" }
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setCurrentUser(null)
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null)
      // For demo purposes
      // In a real app, you would make an API call to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }
      
      const data = await response.json();
      return data;
      */

      // Dummy password change logic
      if (currentPassword === "password") {
        return { success: true, message: "Password changed successfully" }
      } else {
        throw new Error("Current password is incorrect")
      }
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
