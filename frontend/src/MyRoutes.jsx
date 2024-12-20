import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Chat from './Chat';

export default function MyRoutes() {
    const { username, id, loading } = useContext(UserContext);

    return (
        loading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner border-t-blue-500"></div>
            </div>
        ) : id ? (
            <Chat />
        ) : (
            <RegisterAndLoginForm />
        )
    );
}









//     if (loading) {
//         return (
//           <div className="flex items-center justify-center h-screen">
//             <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
//           </div>
//         );
//       }

//     if (username) {
//         return <Chat />;
//     }
//     return <RegisterAndLoginForm />;
// }





