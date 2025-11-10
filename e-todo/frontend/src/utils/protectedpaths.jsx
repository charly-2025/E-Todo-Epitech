import React from "react";
import { Navigate } from "react-router-dom";

const protectedpaths = () => {
    const user = null
    if (user != true){
        return <Navigate to='/login' />
    }  
}

export default protectedpaths;