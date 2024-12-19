import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Define the API URL from environment variables or fallback
const API_URL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com/server";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  // Fetch user profile on app load
  useEffect(() => {
    axios
      .get(`${API_URL}/profile`, { withCredentials: true }) // Ensure credentials (cookies) are sent
      .then((response) => {
        console.log("Profile fetched successfully:", response.data);
        setId(response.data.userId);
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("No profile found. Redirecting to login/registration...");
        setId(null);
        setUsername(null); // Clear user state on failure
      });
  }, []);

  // User Registration Function
  const register = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/profile`,
        { username, password, isNewUser: true }, 
        { withCredentials: true } 
      );
      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  };

  // User Login Function
  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/profile`,
        { username, password, isNewUser: false }, 
        { withCredentials: true } 
      );
      console.log("Login successful:", response.data);
      setId(response.data.id); 
      setUsername(response.data.username); 
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  // User Logout Function
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setId(null);
      setUsername(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  // Context Provider with user state and actions
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}






// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// const API_URL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com";

// export const UserContext = createContext({});
// export function UserContextProvider({children}) {
//     const [username, setUsername] = useState(null);
//     const [id, setId] = useState(null);
    

//     useEffect(() => {
//         // axios.get('/profile')
//         axios
//       .get(`${API_URL}/profile`, { withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${token}`, // Replace `token` with the actual token value
//         },
//        })
//             .then(response => {
//               console.log("Profile fetched successfully:", response.data);
//                 setId(response.data.userId);
//                 setUsername(response.data.username);
//             })
//             .catch(error => {
//                 console.error('Failed to fetch profile:', error.response?.data || error.message);
//                 setId(null);
//                 setUsername(null); 
//             });
//     }, []);
    
//   // Example login functionality
//   const login = async (username, password) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/login`,
//         { username, password },
//         { withCredentials: true } // Send credentials (cookies)
//       );
//       console.log("Login Successful", response.data);
//       setId(response.data.id);
//       setUsername(response.data.username);
//     } catch (error) {
//       console.error("Login Failed:", error.message);
//     }
//   };
//     return (
//         <UserContext.Provider value={{username, setUsername, id, setId}}>
//             {children}
//             </UserContext.Provider>
//     );
// }