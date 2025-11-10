import { Outlet, Navigate } from "react-router-dom";

const protectedpaths = () => {
    const user = null
    return user ? <Navigate to="/login"/>
}

export default protectedpaths;