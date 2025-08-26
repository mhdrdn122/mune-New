import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

import React from 'react'
import { LanguageContext } from "./LanguageProvider";

const UserProvider = ({children}) => {
    const { language } = useContext(LanguageContext);
    // const [userToken,setUserToken]=useState('')
     // Load the token from localStorage initially
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem("userToken") || ""; // Default to empty string if no token is stored
  });

  // Update localStorage whenever the token changes
  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    } else {
      localStorage.removeItem("userToken"); // Clean up if token is removed
    }
  }, [userToken]);

    return (
    <div>
        <UserContext.Provider value={{ language,userToken,setUserToken }}>
            {children}
        </UserContext.Provider>
    </div>
  )
}

export default UserProvider