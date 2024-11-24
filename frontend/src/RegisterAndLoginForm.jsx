import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const RegisterAndLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';
        try {
            const { data } = await axios.post(url, { username, password });
            setLoggedInUsername(username);
            setId(data.id);

            // Clear the input fields
            setUsername(''); // Clear username
            setPassword(''); // Clear password
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }

    return (
        <div className="flex items-center h-screen">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    placeholder="Username"
                    className="block w-full rounded p-2 m-2 border"
                    autoComplete="off" // Prevent browser auto-fill
                />
                <input
                    type="password"
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
                            <button onClick={() => setIsLoginOrRegister('login')}>
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






// import { useState, useContext } from "react";
// import axios from "axios";
// import { UserContext } from "./UserContext";

// const Register = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//    const [isLoginOrRegister, setIsLoginOrRegister] = useState('Register');
//     const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

//     async function register(ev) {
//         ev.preventDefault();
//         try {
//             const { data } = await axios.post('/register', { username, password });
//             setLoggedInUsername(username);
//             setId(data.id);

//             // Clear the input fields
//             console.log("Before clear:", { username, password });
//             setUsername(''); // Clear username
//             setPassword(''); // Clear password
//             console.log("After clear:", { username, password });
//         } catch (error) {
//             console.error("Registration failed:", error);
//         }
//     }

//     return (
//         <div className="flex items-center h-screen">
//             <form className="w-64 mx-auto mb-12" onSubmit={register} autoComplete="off">
//                 <input
//                     type="text"
//                     value={username}
//                     onChange={(ev) => setUsername(ev.target.value)}
//                     placeholder="Username"
//                     className="block w-full rounded p-2 m-2 border"
//                     autoComplete="off" // Prevent browser auto-fill
//                 />
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(ev) => setPassword(ev.target.value)}
//                     placeholder="Password"
//                     className="block w-full rounded p-2 m-2 border"
//                     autoComplete="new-password" // Prevent browser auto-fill
//                 />
//                 <button className="bg-blue-500 text-white block w-full rounded p-2 m-2">
//                   {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
//                  </button>
//                 <div className="text-center mt-2">
//                   {isLoginOrRegister === 'register' ? && (
//                     <div>
//                     Already a member? 
//                     <button onClick={() => setIsLoginOrRegister('login')}>
//                     Login here 
//                     </button>
//                     </div>
//                   )};
//                   {isLoginOrRegister === 'login' && (
//                     <div>
//                     Don't have an accout? 
//                     <button onClick={() => setIsLoginOrRegister('register')}>
//                     Register 
//                     </button>
//                     </div>
//                   )}
//                   </div>
//             </form>
//         </div>
//     );
// };

// export default Register;


