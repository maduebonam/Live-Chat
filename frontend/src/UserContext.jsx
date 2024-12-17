import axios from "axios";
import { createContext, useEffect, useState } from "react";


const API_URL = process.env.REACT_APP_API_URL || "https://maduchat.onrender.com";
export const UserContext = createContext({});
export function UserContextProvider({children}) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    

    useEffect(() => {
        // axios.get('/profile')
        axios
      .get(`${API_URL}/profile`)
            .then(response => {
                setId(response.data.userId);
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error('Failed to fetch profile:', error);
                setId(null);
                setUsername(null);
            });
    }, []);
    
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
            </UserContext.Provider>
    );
}