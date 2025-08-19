import {  useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import AdvertismentSlider from "../template1/AdvertismentSlider"
import CatContainer from "./CatContainer";
import axios from "axios";
import { LanguageContext } from "../../../context/LanguageProvider";
import Cover from "../template1/Cover";
import SearchInput from "../../../utils/user/SearchInput";
import NavBarUser from "../../../utils/user/NavBarUser";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";
import { baseURLPublicName } from "../../../Api/baseURL";

const CategoriesTemp9 = () => {
    const { adminDetails, updateUsername } = useContext(AdminContext);
    const [searchWord, setSearchWord] = useState("");
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [shouldFetchAllCategories, setShouldFetchAllCategories] =
      useState(false);
    const { categories, setCategories, pageCount } =
      useContext(CategoriesContext);
    const { language, toggleLanguage } = useContext(LanguageContext);
    const { username } = useParams();
    const handleUpdateUsername = () => {
      updateUsername(username);
    };
    useEffect(() => {
      handleUpdateUsername();
    }, []);
    async function getProduct(word) {
      try {
        setPending(true);
        setError("");
        setCategories([]);
        const config = {
          headers: {
            language: language,
          },
        };
        const response = await axios.get(
          `${baseURLPublicName}/user_api/show_admin_categories?adminId=${
            adminDetails && adminDetails.id
          }&search=${word}`,
          config
        );
        setCategories(response.data.data);
        setError("");
      } catch (e) {
        setCategories([]);
        setError(e.response.data.message);
        console.log(e);
      } finally {
        setPending(false);
      }
    }
    
    useEffect(() => {
      const timer = setTimeout(() => {
        if (Object.keys(adminDetails).length > 0) {
          if (searchWord !== "") {
            getProduct(searchWord);
            setShouldFetchAllCategories(true);
          } else {
            // If searchWord is empty, decide whether to fetch all categories or not
            if (shouldFetchAllCategories) {
              getProduct(searchWord);
            }
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }, [searchWord, adminDetails]);
  
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
        <Cover />
        <div className="right_section_temp4">
      <div className="">
        <AdvertismentSlider num={1} />
      </div>
        
      <div className="">
        {error && <div className="text-center text-danger my-5">{error}</div>}

        {pending && (
          <p className="w-100 text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
          </p>
        )}

        <CatContainer />

      </div>
      <SearchInput
        showModal={showModal}
        handleClose={handleClose}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        language={language}
      />
      <SidebarBottom adminDetails={adminDetails} />
      
      </div>
    </div>
  )
}

export default CategoriesTemp9