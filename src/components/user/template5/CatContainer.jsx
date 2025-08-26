import React, { useContext, useEffect } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import Slider from "react-slick";
import { Link, useParams } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import baseURLTest from "../../../Api/baseURLTest";

const CatContainer = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
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
  console.log(categories);

  const onPress = async (page) => {
    const config = {
      headers: {
        language: language,
      },
    };
    // const response = await axios.get(
    //   `https://api.menu.sy/user_api/show_admin_categories?adminId=${adminDetails.id}&page=${page}`,
    //   config
    // );
    const response = await baseURLTest.get(
      `/customer_api/show_restaurant_categories?restaurant_id=${
        adminDetails && adminDetails.id
      }&page=${page}`,
      config
    );
    // console.log(response.data.data);
    setCategories(response.data.data);
  };

  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: categories?.length < 4 ? categories?.length: 4,
  //   slidesToScroll: 4,
  //   autoplay: false,
  //   autoplaySpeed: 2000,
  //   // waitForAnimate: true,
  //   // adaptiveHeight: true,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         rows:2,
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //       }
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         rows:2,
  //         slidesToShow: 2,
  //         slidesToScroll: 2,
  //       },
  //     },
  //   ],
  // };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div
        className="offers_temp5"
        style={{ flexDirection: language === "en" ? "row" : "row-reverse" }}
      >
        {categories
        ?.map((cat) => {
          return (
            <Link
              to={`${
                cat.content === 0
                  ? ""
                  : cat.content === 1
                  ? `/${username}/template/5/category/${cat.id}`
                  : `/${username}/template/5/category/${cat.id}/sub-category/0`
              }`}
              key={cat.id}
            >
                {/* Parent container */}
                <div
                  className="offer_temp5"
                  style={{
                    position: "relative", // Required for background layering
                    overflow: "hidden", // Ensures no overflow issues
                  }}
                >
                  {/* Background layer */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `#${
                        adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                      }`,
                      opacity: adminDetails?.sub_opacity??adminDetails?.sub_opacity, 
                      zIndex: 1, // Place behind content
                      pointerEvents: "none", // Prevent cursor issues
                    }}
                  ></div>
                  
                  <div
                    style={{
                      position: "relative", // Make sure the content is above the background
                      zIndex: 2,
                    }}
                  >
                    {/* Image */}
                    <LazyLoadImage
                      src={`${cat.image}`}
                      alt="category"
                      className=""
                      effect="blur"
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.35)", 
                      }}
                    />
  
                    {/* Category name */}
                    <p
                      className="w-100 categoryColor text-center font"
                      style={{
                        direction: language === "en" ? "ltr" : "rtl",
                        color: "#000", // Optional: Customize text color
                        fontFamily: adminDetails?.font_category,
                        fontSize:`${adminDetails.font_size_category}em`??'',
                        fontWeight:adminDetails?.font_bold_category?'bold':'none',
                      }}
                    >
                      {localStorage.getItem('language')=="en"?cat.name_en:cat.name_ar}
                      {/* {cat.name} */}
                    </p>
                  </div>
                </div>          
                  </Link>
          );
        })}
      </div>
      {pageCount.current > 1 ? (
        <div className="pt-3 pb-5">
          <Pagination pageCount={pageCount.current} onPress={onPress} />
        </div>
      ) : null}
    </div>
  );
};

export default CatContainer;
