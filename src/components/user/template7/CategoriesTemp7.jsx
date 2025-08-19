import {  useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import CatContainer from "./CatContainer";
import Cover from "../template1/Cover";
import NavBarUser from "../../../utils/user/NavBarUser";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";
import { baseURLPublicName } from "../../../Api/baseURL";

const CategoriesTemp7 = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [searchWord, setSearchWord] = useState("");
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        ...(adminDetails?.background_image_category && adminDetails?.image_or_color==1
            ? {
                backgroundImage: `url(${baseURLPublicName}/storage${adminDetails?.background_image_category})`,
                backgroundSize: "cover", // Ensures the image covers the entire background
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat", // Prevents tiling
                backgroundAttachment: "fixed", // Fixes the background to the viewport
              }
            : {
                backgroundColor: `#${
                  adminDetails && 
                  adminDetails?.background_color && 
                  adminDetails?.background_color?.substring(10, 16) // Fallback to white
                }`,
              }),
      }}
    >
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
      <div className="p-2 pt-0">
        <Cover />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center mt-5 w-full">
        <div className="w-full p-2">
          <AdvertismentSlider num={1} />
        </div>
        <div className="pb-5">
          <CatContainer />
        </div>
        <SidebarBottom adminDetails={adminDetails} />
      </div>
      
    </div>
  )
}

export default CategoriesTemp7