import axios from 'axios';
import { UserContextProvider } from "./UserContext";
import MyRoutes from "./MyRoutes";


function App() {
//axios.defaults.baseURL = 'http://localhost:5000'; // Backend URL
//axios.defaults.withCredentials = true; // Enable sending cookies with requests
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com/server"; 
    axios.defaults.withCredentials = true; 

  return (
    
      <UserContextProvider>
      <MyRoutes />
      </UserContextProvider>
    
  )
}

export default App;    
