import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
// import { CategoriesContext } from '../../../context/CategoriesProvider';
// import { AdminContext } from '../../../context/AdminProvider';
// import { LanguageContext } from '../../../context/LanguageProvider';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import baseURLTest from "../../../Api/baseURLTest";

export default function CategoriesSlider({
  categories,
  setCategories,
  pageCount,
  username,
  error,
  pending,
}) {
  const { adminDetails } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

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
    pageCount.current = response.data.meta.total_pages;
    setCategories(response.data.data);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="categories">
        {error && (
          <h5 className="text-center mt-5 font">
            {" "}
            {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}{" "}
          </h5>
        )}

        {pending && (
          <p className="text-center mt-5">
            <div className="spinner-border color" role="status">
              <span className="sr-only"></span>
            </div>
          </p>
        )}
        <div className="flex  gap-3">
          {categories?.map((cat) => {
          return (
            <Link
              to={`/${username}/template/1/category/${cat.id}`}
              key={cat.id}
              className="  bg-gray-300 border-1 rounded-xl  p-4"
            >
              <div className="category_temp1">
                <LazyLoadImage
                  src={cat.image}
                  alt="category"
                  style={{
                    background: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                  }}
                  effect="blur"
                />
                <p
                  className="pt-2 text-capitalize text-black categoryColor font"
                  style={{
                    fontFamily: adminDetails?.font_category,
                    fontSize: `${adminDetails.font_size_category}em` ?? "",
                    fontWeight: adminDetails?.font_bold_category
                      ? "bold"
                      : "none",
                  }}
                >
                  {localStorage.getItem("language") == "en"
                    ? cat.name_en
                    : cat.name_ar}
                  {/* {cat.name} */}
                </p>
              </div>
            </Link>
          );
        })}
        </div>
        
      </div>
      {pageCount.current > 1 ? (
        <div className="pb-5">
          <Pagination pageCount={pageCount.current} onPress={onPress} />
        </div>
      ) : null}
    </div>
  );
}
