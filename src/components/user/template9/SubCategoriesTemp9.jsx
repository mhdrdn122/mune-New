import {  useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import Pagination from "../template1/Pagination";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { useMediaQuery } from "@uidotdev/usehooks";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetSubCat } from "../../../hooks/user/useGetSubCat";
import PlusButton from "../../../utils/user/PlusButton";
import "animate.css";
import { baseURLPublicName } from "../../../Api/baseURL";

const SubCategoriesTemp9 = () => {
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
    const { adminDetails, updateUsername } = useContext(AdminContext);
    const { categories } = useContext(CategoriesContext);
    const { language } = useContext(LanguageContext);
  
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
  
    const { id, username } = useParams();
    const pageCountSub = useRef();
    const navigate = useNavigate();
  
    const handleUpdateUsername = () => {
      updateUsername(username);
    };
  
    useEffect(() => {
      handleUpdateUsername();
    }, []);

    const {
        pending,
        isError,
        subCat,
        searchWord,
        setSearchWord,
        onPress,
      } = useGetSubCat();
    
      const handleClick = (id2) => {
        navigate(`/${username}/template/32/category/${id}/sub-category/${id2}`);
      };  
  return (
    <div
    style={{
      minHeight: "95dvh",
      ...(adminDetails?.background_image_sub && adminDetails?.image_or_color
        ? {
            backgroundImage: `url(${baseURLPublicName}/storage${adminDetails?.background_image_sub})`,
            backgroundSize: "cover", // Ensures the image covers the entire background
            backgroundPosition: "bottom", // Centers the image
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
    }}>
    <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
     {isError && (
        <h3 className="w-100 text-center mt-5">
          {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}
        </h3>
      )}
      {!isError && (
        <div
          style={{
            textDecoration: "none",
            color: "#111",
            fontSize: "24px",
            padding: "10px 20px",
            borderRadius: "5px",
            display: "inline-block",
            cursor: "pointer",
          }}
          className="color"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack />
        </div>
      )}
    <div
          className="bottom_section_temp4"
          style={{ flexDirection: language === "en" ? "row" : "row-reverse" }}
        >
          {!isError && (
            <div
              className="offers_temp5_sub"
              style={{ flexWrap: "wrap" }}
            >
              {subCat &&
                subCat.map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleClick(sub.id)}
                      className="offer_temp5"
                      style={{
                        position: "relative", // Required for background layering
                        overflow: "hidden", // Ensures no overflow issues
                        cursor: "pointer",
                      }}
                    >
                      {/* Background Layer */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: `#${
                            adminDetails &&
                            adminDetails.color &&
                            adminDetails.color.substring(10, 16)
                          }`,
                          opacity: adminDetails?.sub_opacity??adminDetails?.sub_opacity, 
                          zIndex: 1,  
                          pointerEvents: "none", // Prevent cursor issues
                        }}
                      ></div>
  
                      {/* Content Wrapper */}
                      <div
                        style={{
                          position: "relative", // Ensures content is above the background
                          zIndex: 2,
                        }}
                      >
                        {/* Subcategory Image */}
                        <LazyLoadImage
                          src={sub.image}
                          effect="blur"
                          style={{
                            minWidth: "100%",
                            maxWidth: "100%",
                            height: "100%",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", 
                          }}
                        />
                        {/* Subcategory Name */}
                        <h5
                          className="text-center w-100 text-break subCatColor font"
                          style={{
                            direction: language === "en" ? "ltr" : "rtl",
                            color: "#000",
                            fontFamily: adminDetails?.font_category,
                            fontSize:`${adminDetails.font_size_category}em`??'',
                            fontWeight:adminDetails?.font_bold_category?'bold':'none',
                          }}
                        >
                          {sub.name}
                        </h5>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <PlusButton change={true} />
         {pageCountSub.current > 1 ? (
                <div className="mb-2">
                  <Pagination pageCount={pageCountSub.current} onPress={onPress} />
                </div>
              ) : null}
  </div>
  )
}

export default SubCategoriesTemp9