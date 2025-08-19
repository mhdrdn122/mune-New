import search from "../../../assets/User/icon _search outline_.png";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Dropdown, Form, Modal } from "react-bootstrap";
 import axios from "axios";
import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import "./styleTemp6.css";
import "./styleBreadcrump.scss";
// import logo from "../../assets/orientLogo.png";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import Search from "./Search";
import { GrPrevious } from "react-icons/gr";
import NavBarTmp6 from "./NavBarTmp6";
import { useGetSubCat } from "../../../hooks/user/useGetSubCat";
import PlusButton from "../../../utils/user/PlusButton";
import Pagination from "../template1/Pagination";

const CategoriesTemp6 = () => {
  const { adminDetails } = useContext(AdminContext);
  const { categories } = useContext(CategoriesContext);
  const { language } = useContext(LanguageContext);
  const { id } = useParams();

  const { username } = useParams();
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

  let selectedItem = "";
  const getItemById = (id) => {
    const parsedId = parseInt(id, 10); // Parse id to a number
    return categories?.find((item) => item.id === parsedId);
  };

  selectedItem = getItemById(id);


  return (
    <div
      style={{
        minHeight: "100vh",
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
      }}
    >
      <NavBarTmp6 searchWord={searchWord} setSearchWord={setSearchWord} />

      <nav>
        <ol className="breadcrumb-list">
          <li className="breadcrumb_item">
            <span
              className="previous"
              style={{
                color: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
                padding: "0 10px",
              }}
            >
              <GrPrevious />
            </span>
            <Link to={`/${username}/template/6/categories`} className="font">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>
          <li className="breadcrumb_item active font">
            {" "}
            {selectedItem && selectedItem.name}
          </li>
        </ol>
      </nav>

      {isError && (
        <h3 className="text-center text-light mt-5 font">
          {error?.data?.message}
        </h3>
      )}

      {pending && (
        <p className="w-100 text-center mt-5">
          <div className="spinner-border color" role="status">
            <span className="sr-only"></span>
          </div>
        </p>
      )}

      <div
        className="d-flex flex-column"
        style={{
          minHeight: "calc(100vh - 124px)",
        }}
      >
        <div className="orient_cats_container">
          {!pending&& subCat &&
            subCat.length > 0 &&
            subCat.map((sub) => {
              return (
                <Link
                  to={
                    sub.content === 1
                      ? `/${username}/template/6/categories/${sub.id}}`
                      : `/${username}/template/6/categories/${id}/sub-category/${sub.id}}`
                  }
                  key={sub.id}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    backgroundColor: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                  }}
                  className="orient_category"
                >
                  <p
                    className="subCatColor font"
                    style={{ direction: language === "en" ? "ltr" : "rtl" ,
                      fontFamily: adminDetails?.font_category,
                      fontSize:`${adminDetails.font_size_category}em`??'',
                      fontWeight:adminDetails?.font_bold_category?'bold':'none',
                    }}
                  >
                    {/* {sub.name} */}
                    {localStorage.getItem('language')=="en"?sub.name_en:sub.name_ar}

                  </p>
                </Link>
              );
            })}
        </div>

        {pageCountSub.current > 1 ? (
          <div
            className="py-1 m-auto"
            style={{ flex: "1", display: "flex", alignItems: "end" }}
          >
            <Pagination pageCount={pageCountSub.current} onPress={onPress} />
          </div>
        ) : null}
      </div>

      <PlusButton />
    </div>
  );
};

export default CategoriesTemp6;
