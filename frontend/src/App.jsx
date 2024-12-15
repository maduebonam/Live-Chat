import axios from 'axios';
import { UserContextProvider } from "./UserContext";
import MyRoutes from "./MyRoutes";


function App() {
axios.defaults.baseURL = 'http://localhost:5000'; // Backend URL
axios.defaults.withCredentials = true; // Enable sending cookies with requests


  return (
    
      <UserContextProvider>
      <MyRoutes />
      </UserContextProvider>
    
  )
}

export default App;    
