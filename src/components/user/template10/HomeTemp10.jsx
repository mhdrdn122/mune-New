import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import CatContainer from "./CatContainer";
import Cover from "../template1/Cover";
import NavBarUser from "../../../utils/user/NavBarUser";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";
import { baseURLPublicName } from "../../../Api/baseURL";
import DynamicSkeleton from "../../../utils/DynamicSkeletonProps";

const HomeTemp10 = () => {
  const { adminDetails, updateUsername , loading } = useContext(AdminContext);
  const [searchWord, setSearchWord] = useState("");
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);
  console.log(adminDetails)

  if (loading) {

    return (
      <div className="flex flex-col  gap-3 p-3">
        <div>

          <DynamicSkeleton
            count={1}
            variant="rounded"
            height={350}
            animation="wave"
            spacing={3}
            columns={{ xs: 12, sm: 12, md: 12 }}

          />
        </div>


        <div>
          <DynamicSkeleton
            count={3}
            variant="rounded"
            height={250}
            animation="wave"
            spacing={3}
            columns={{ xs: 12, sm: 6, md: 4 }}

          />
        </div>
      </div>

    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        ...(adminDetails?.background_image_category && adminDetails?.image_or_color == 1
          ? {
            backgroundImage: `url(${baseURLPublicName}/storage${adminDetails?.background_image_category})`,
            backgroundSize: "cover", // Ensures the image covers the entire background
            backgroundPosition: "center", // Centers the image
            backgroundRepeat: "no-repeat", // Prevents tiling
            backgroundAttachment: "fixed", // Fixes the background to the viewport
          }
          : {
            backgroundColor: `#${adminDetails &&
              adminDetails?.background_color &&
              adminDetails?.background_color?.substring(10, 16) // Fallback to white
              }`,
          }),
      }}
    >
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
      <div className=" pt-0 mb-5">
        <Cover />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center mt-5 w-full">
        <div className="w-full p-2 mt-10">
          <AdvertismentSlider />
        </div>
        <div className="pb-5  ">
          <CatContainer />
        </div>
        <SidebarBottom adminDetails={adminDetails} />
      </div>

    </div>
  )
}

export default HomeTemp10