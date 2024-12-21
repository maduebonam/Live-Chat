import axios from 'axios';
import { UserContextProvider } from "./UserContext";
import MyRoutes from "./MyRoutes";


function App() {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com"; 
    axios.defaults.withCredentials = true; 

  return (
    
      <UserContextProvider>
      <MyRoutes />
      </UserContextProvider>
    
  )
}

export default App;    
