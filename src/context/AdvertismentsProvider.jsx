import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AdminContext } from "./AdminProvider";
import baseURLTest from "../Api/baseURLTest";
import { LanguageContext } from "./LanguageProvider";

export const AdvertismentsContext = createContext();

const AdvertismentsProvidr = ({ children }) => {
  const [advertisments, setAdvertisments] = useState([]);
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  // console.log(adminDetails);
  // const handleUpdateUsername = () => {
  //   updateUsername('username');
  // };
  // useEffect(() => {
  //   handleUpdateUsername();
  // }, []);
  useEffect(() => {
    async function getAdvertisments() {
      try {
        const config = {
          headers: {
            language: language,
          },
        };
        // const response = await axios.get(
        //   `https://api.menu.sy/user_api/show_advertisements?adminId=${adminDetails?.id}`
        // );
        const response = await baseURLTest.get(
          `/customer_api/show_advertisements?restaurant_id=${
            adminDetails && adminDetails.id
          }`,
          config
        );
        console.log(response);
        setAdvertisments(response.data.data);
      } catch (error) {
        // console.error(error);
      }
    }
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      getAdvertisments();
    }
  }, [adminDetails]);

  return (
    <AdvertismentsContext.Provider value={{ advertisments }}>
      {children}
    </AdvertismentsContext.Provider>
  );
};

export default AdvertismentsProvidr;
