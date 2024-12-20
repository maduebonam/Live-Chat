import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Define the API URL from environment variables or fallback
const API_URL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com/server";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Fetch user profile on app load
  
    useEffect(() => {
      async function fetchProfile() {
          try {
              const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
              setId(response.data.id);
              setContextUsername(response.data.username);
              //setLoggedInUsername(response.data.username);
              setLoading(false);
          } catch (err) {
              console.error('Not authenticated:', err);
            } finally {
              setLoading(false);  // Ensure the form shows on failed auth
          }
      }
      fetchProfile();
  }, []);
  

 
  // Context Provider with user state and actions
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId, loading }}>
      {children}
    </UserContext.Provider>
  );
}



//useEffect(() => {
// axios
// .get(`${API_URL}/profile`, { withCredentials: true }) // Ensure credentials (cookies) are sent
// .then((response) => {
//   //console.log("Profile fetched successfully:", response.data);
//   setId(response.data.userId);
//   setUsername(response.data.username);
// })
// .catch(() => {
//   //console.error("No profile found. Redirecting to login/registration...");
//   setId(null);
//   setUsername(null); // Clear user state on failure
// })
// .finally(() => {
//   setLoading(false); // Set loading to false after the request completes
// });
// }, []);