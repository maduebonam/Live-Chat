import axios from "axios";
import { createContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com";

export const UserContext = createContext({});
export function UserContextProvider({children}) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    

    useEffect(() => {
        // axios.get('/profile')
        axios
      .get(`${API_URL}/profile`, { withCredentials: true })
            .then(response => {
              console.log("Profile fetched successfully:", response.data);
                setId(response.data.userId);
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error('Failed to fetch profile:', error.response?.data || error.message);
                setId(null);
                setUsername(null); 
            });
    }, []);
    
  // Example login functionality
  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { username, password },
        { withCredentials: true } // Send credentials (cookies)
      );
      console.log("Login Successful", response.data);
      setId(response.data.id);
      setUsername(response.data.username);
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
            </UserContext.Provider>
    );
}