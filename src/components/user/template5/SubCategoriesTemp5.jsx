import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import Pagination from "../template1/Pagination";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { useMediaQuery } from "@uidotdev/usehooks";
import { IoMdArrowRoundBack } from "react-icons/io";
import SearchInput from "../../../utils/user/SearchInput";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetSubCat } from "../../../hooks/user/useGetSubCat";
import PlusButton from "../../../utils/user/PlusButton";

const SubCategoriesTemp5 = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { categories } = useContext(CategoriesContext);
  const { language } = useContext(LanguageContext);

  // const [subCat, setSubCat] = useState([]);
  // const [searchWord, setSearchWord] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const handleClick = (sub) => {
    console.log('sub : ',sub)
    if(sub.content === 1){
      navigate(`/${username}/template/5/category/${sub.id}`);
    }else {
      navigate(`/${username}/template/5/category/${id}/sub-category/${sub.id}`);
    }
  };
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const {
    pending,
    isError,
    error,
    subCat,
    searchWord,
    setSearchWord,
    onPress,
    pageCountSub,
  } = useGetSubCat();

  console.log(isError);


  return (
    <div style={{ minHeight: "100vh",
      ...(adminDetails?.background_image_category  && adminDetails?.image_or_color
        ? {
            backgroundImage: `url(${adminDetails?.background_image_category})`,
            backgroundSize: "cover", // Ensures the image covers the entire background
            backgroundPosition: "center", // Centers the image
            backgroundRepeat: "no-repeat", // Prevents tiling
          }
        : {
            backgroundColor: `#${
              adminDetails && 
              adminDetails?.background_color && 
              adminDetails?.background_color?.substring(10, 16) // Fallback to white
            }`,
          }),
    }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      {isError && (
        <div className="alert alert-danger font" role="alert">
          {error.data.message}
        </div>
      )}

      {!isError && (
        <div
          style={{
            textDecoration: "none",
            color: "#111",
            // backgroundColor: "",
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
        // style={{ flexDirection: language === "en" ? "row" : "row-reverse" }}
      >

        {pending ? (
          <p className="w-100 text-center mt-5">
            <div className="spinner-border color" role="status">
              <span className="sr-only"></span>
            </div>
          </p>
        ) : (
          <div
            className="d-flex flex-column"
            style={{
              minHeight: "calc(100vh - 124px)",
              width: isSmallDevice
                ? "calc(100vw-10px)" /*calc(100vw - 80px)*/
                : "calc(100vw - 114px)",
            }}
          >
            <div
              className="offers_temp5_sub"
              style={{ flexWrap: "wrap"}}
            >
              {subCat &&
                subCat
                  .map((sub) => {
                    return (
                      <div
                      key={sub.id}
                      onClick={() => handleClick(sub)}
                      className="offer_temp5"
                      style={{
                        position: "relative", // Required for background layering
                        overflow: "hidden", // Ensures no overflow issues
                        cursor: "pointer",
                        // flexDirection: language === "en" ? "row" : "row-reverse"                      
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
                          src={`${sub?.image}`}
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
                            // direction: language === "en" ? "ltr" : "rtl",
                            color: "#000",
                            fontFamily: adminDetails?.font_category,
                            fontSize:`${adminDetails.font_size_category}em`??'',
                            fontWeight:adminDetails?.font_bold_category?'bold':'none',
                          }}
                        >
                          {/* {sub.name} */}
                      {localStorage.getItem('language')=="en"?sub.name_en:sub.name_ar}

                        </h5>
                      </div>
                    </div>
                    );
                  })}
            </div>

            {pageCountSub.current > 1 ? (
              <div className="py-1 m-auto" style={{flex: '1', display: 'flex', alignItems:'end'}}>
                <Pagination
                  pageCount={pageCountSub.current}
                  onPress={onPress}
                />
              </div>
            ) : null}
          </div>
        )}

        {
          //  <SearchInput
          //   showModal={showModal}
          //   handleClose={handleClose}
          //   searchWord={searchWord}
          //   setSearchWord={setSearchWord}
          //   language={language}
          // />
        }

        <PlusButton />
      </div>
    </div>
  );
};

export default SubCategoriesTemp5;
