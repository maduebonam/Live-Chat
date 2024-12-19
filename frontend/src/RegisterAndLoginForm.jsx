import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const RegisterAndLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('Login');
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        // const url = isLoginOrRegister === 'register' ? 'register' : 'login';
               const url = isLoginOrRegister === 'register' ? 'http://localhost:5000/register' : 'http://localhost:5000/login'; // Set the URL based on action
                try {
                axios.post(url, { username, password }, { withCredentials: true })
                .then(response => {
                    setLoggedInUsername(username);
                    setId(response.data.id); // Set user ID
                })
                .catch(error => {
                    console.error("Login or Registration failed:", error);
                });
            

            // Clear the input fields
            setUsername(''); // Clear username
            setPassword(''); // Clear password
        } catch (error) {
            console.error("Login or Registration failed:", error);
        }
    }

    return (
        <div className="flex items-center h-screen">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"                  
                    id="username"
                    name="username"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
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

