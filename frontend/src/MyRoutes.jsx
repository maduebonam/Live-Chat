import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Chat from './Chat';

export default function MyRoutes() {
    const { username, id } = useContext(UserContext);

    if (username) {
        return <Chat />;
    }
    return (
       <RegisterAndLoginForm /> 
    );
}





// import Register from "./Register";
// import { useContext } from "react";
// import { UserContext } from "./UserContext";

// export default function myRoutes() {
//     const {username, id} = useContext(UserContext);

//     if (username) {
//         return 'logged in';
//     }

//     return(
//         <Register/>
//     );
// }