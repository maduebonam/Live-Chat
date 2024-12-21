import axios from "axios";
import { createContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com";

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
  const [username, setContextUsername] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true); 

    useEffect(() => {
      async function fetchProfile() {
          try {
              const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
              setId(response.data.id);
              setContextUsername(response.data.username);
              setLoading(false);
          } catch (err) {
              console.error('Not authenticated:', err);
            } finally {
              setLoading(false);  
          }
      }
      fetchProfile();
  }, []);
  
  return (
    <UserContext.Provider value={{ username, setContextUsername, id, setId, loading }}>
      {children}
    </UserContext.Provider>
  );
}

