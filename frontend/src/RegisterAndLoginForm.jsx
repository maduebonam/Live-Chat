import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";


const RegisterAndLoginForm = () => {
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('Login');
    const { setContextUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        
        const API_URL = import.meta.env.VITE_API_URL || "https://maduchat.onrender.com";

        const url = isLoginOrRegister === 'register' ? `${API_URL}/register` : `${API_URL}/login`;

               //const url = isLoginOrRegister === 'register' ? 'http://localhost:5000/register' : 'http://localhost:5000/login'; // Set the URL based on action
               try {
                const response = await axios.post(url, { username, password }, { withCredentials: true });
                // const response = await axios.post('/server/login', { username, password }, { withCredentials: true });
               
                console.log('Login successful:', response.data);
               
                setContextUsername(username);
                setId(response.data.id); // Set user ID
              } catch (error) {
                console.error("Login or Registration failed:", error);
              }
          
            // Clear the input fields
            setLocalUsername(''); // Clear username
            setPassword(''); // Clear password
        }
    

    return (
        <div className="flex items-center h-screen">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"                  
                    id="username"
                    name="username"
                    value={username}
                    onChange={(ev) => setLocalUsername(ev.target.value)}
                    placeholder="Username"
                    className="block w-full rounded p-2 m-2 border"
                    autoComplete="off" // Prevent browser auto-fill
                    
                />
                <input
                    type="password"
                    name="password"  
                    id="password"    
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Password"
                    className="block w-full rounded p-2 m-2 border"
                    autoComplete="new-password" // Prevent browser auto-fill
                />
                <button className="bg-blue-500 text-white block w-full rounded p-2 m-2">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' && (
                        <div>
                            Already a member? 
                            <button className="ml-1" onClick={() => setIsLoginOrRegister('login')}>
                                Login here 
                            </button>                      
                        </div>
                    )}
                    {isLoginOrRegister === 'login' && (
                        <div>
                            Don't have an account? 
                            <button onClick={() => setIsLoginOrRegister('register')}>
                                Register 
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default RegisterAndLoginForm;

