import { Navigate, Outlet } from "react-router-dom";

const IsLogged = ({children}) => {
    const Logged = localStorage.getItem("token");
    if (Logged){
        return <Navigate to='/user' replace/>
    }
    return children ?? null
}

export default IsLogged