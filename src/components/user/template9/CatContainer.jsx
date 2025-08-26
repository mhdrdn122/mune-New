import React, { useContext, useEffect } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { baseURLPublicName } from "../../../Api/baseURL";

const CatContainer = () => {
    const { adminDetails, updateUsername } = useContext(AdminContext);
    const { categories, setCategories, pageCount } =
      useContext(CategoriesContext);
    const { language } = useContext(LanguageContext);
  
    const { username } = useParams();
    const handleUpdateUsername = () => {
      updateUsername(username);
    };
    useEffect(() => {
      handleUpdateUsername();
    }, []);
  
    const onPress = async (page) => {
      const config = {
        headers: {
          // language: language,
          language: localStorage.getItem('language'),
        },
      };
      const response = await axios.get(
        `${baseURLPublicName}/user_api/show_admin_categories?adminId=${adminDetails.id}&page=${page}`,
        config
      );
      setCategories(response.data.data);
    };
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
    <div
      className="offers_temp7"
      style={{
        flexDirection: language === "en" ? "row" : "row-reverse",
      }}
    >
        {categories?.map((cat) => {
            return (
                <Link
                    to={`${
                    cat.content === 0
                        ? ""
                        : cat.content === 1
                        ? `/${username}/template/32/category/${cat.id}`
                        : `/${username}/template/32/category/${cat.id}/sub-category/0`
                    }`}
                    key={cat.id}
                    style={{ textDecoration: "none" }}
                >
                    {/* Parent container */}
                    <div
                    className="offer_temp5"
                    style={{
                        position: "relative", 
                        overflow: "hidden", 
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
                    className="inside"
                        style={{
                        position: "relative", 
                        zIndex: 2,
                        }}
                    >
                        {/* Image */}
                        <LazyLoadImage
                        src={cat.image}
                        alt="category"
                        className=""
                        effect="blur"
                        style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.35)", 
                        }}
                        />
                        {/* Category name */}
                        <p
                        className="w-100 categoryColor text-center"
                        style={{
                            direction: language === "en" ? "ltr" : "rtl",
                            color: "#000",
                            fontFamily: adminDetails?.font_category,
                            fontSize:`${adminDetails.font_size_category}em`??'',
                            fontWeight:adminDetails?.font_bold_category?'bold':'none',
                        }}
                        >
                        {cat.name}
                        </p>
                    </div>
                </div>
            </Link>
            );
            })}
    </div>
    </div>
  )
}

export default CatContainer