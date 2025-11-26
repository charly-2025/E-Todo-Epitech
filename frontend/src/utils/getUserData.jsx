import { useState, useEffect } from 'react';


export default function useUserData(){
    const[user_data,setUser_data] = useState("");
    
    
    useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          headers: {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json",
          },
        });
        const userdata = await response.json();
        setUser_data(userdata);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    }, []);
    return [user_data,setUser_data];
}