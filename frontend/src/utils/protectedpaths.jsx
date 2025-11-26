import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () =>{
    const authentication = localStorage.getItem("auth");
    return (
        authentication ? <Outlet/> : <Navigate to="/login"/>
    )
}


export default PrivateRoute