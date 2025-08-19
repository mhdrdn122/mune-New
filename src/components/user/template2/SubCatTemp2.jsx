import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import rec1 from "../../../assets/User/Rectangle 74.png";
import rec2 from "../../../assets/User/Rectangle 6.png";
import rec3 from "../../../assets/User/Rectangle 11.png";
import search from "../../../assets/User/icon _search outline_.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import CategoriesContainer from "./CategoriesContainer";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import Slider from "react-slick";
 
import { Dropdown, Form, Modal, Spinner } from "react-bootstrap";
import searchIcon from "../../../assets/User/_search outline.png";
import Pagination from "../template1/Pagination";
import facebook from "../../../assets/User/face 1.png";
import insta from "../../../assets/User/insta 1.png";
import { LanguageContext } from "../../../context/LanguageProvider";
import NavBarrr from "../../../utils/user/NavBarUser";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import Cover from "../template1/Cover";
import NavBarUser from "../../../utils/user/NavBarUser";
import SearchInput from "../../../utils/user/SearchInput";
import baseURLTest from "../../../Api/baseURLTest";
import { useGetSubCatsQuery } from "../../../redux/slice/user section/subCatsApi";
import { IoMdArrowRoundBack } from "react-icons/io";
import PlusButton from "../../../utils/user/PlusButton";

const SubCatTemp2 = () => {
  const navigate = useNavigate();
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  // const [pending, setPending] = useState(true);
  // const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [subCat, setSubCat] = useState([]);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const pageCountSub = useRef();
  const { username } = useParams();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const {
    data: subCategories,
    isError,
    isSuccess,
    error,
    isLoading,
    isFetching: pending,
  } = useGetSubCatsQuery(
    {
      resId: adminDetails && adminDetails.id,
      catId: id,
      word: debouncedSearch,
      page,
      language,
    },
    { skip: !get }
  );

  console.log(subCategories);

  useEffect(() => {
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      setGet(true);
    }
  }, [adminDetails]);

  useEffect(() => {
    if (!pending && isSuccess) {
      setSubCat(subCategories.data);
      pageCountSub.current = subCategories.meta.total_pages;
    }
  }, [pending, isSuccess, subCategories]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);

  const onPress = (page) => {
    setPage(page);
  };

  const getUrl = (sub) => {
    if (sub.content === 1) {
      navigate(`/${username}/template/2/category/${sub.id}`);
    } else {
      navigate(`/${username}/template/2/category/${id}/sub-category/${sub.id}`);
    }
  };

   return (
    <div style={{ minHeight: "100vh", display: "" }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      {isError && <h3 className="text-center mt-5">{error?.data?.message}</h3>}

      {
        //   pending && (
        //   <p className="text-center mt-5">
        //     <Spinner className="m-auto" animation="border" variant="primary" />
        //   </p>
        // )
      }

      <div>
        {
          //   <Link to={adminDetails.cover}>
          //   <img
          //     src={adminDetails.cover}
          //     alt="ar"
          //     style={{ minWidth: "310px", minHeight: "200px" }}
          //   />
          // </Link>
        }

        <div
          className="d-flex"
          style={{
            flexDirection: language === "en" ? "row" : "row-reverse",
          }}
        >
          <div
            className="left_section mt-5 py-5"
            style={{
              background: `#${
                adminDetails &&
                adminDetails.color &&
                adminDetails.color.substring(10, 16)
              }`,
            }}
          >
            {categories &&
              categories.slice(0, 5).map((cat) => {
                return (
                  <Link
                    to={`${
                      cat.content === 0
                        ? ""
                        : cat.content === 1
                        ? `/${username}/template/2/category/${cat.id}`
                        : `/${username}/template/2/category/${cat.id}/sub-category/0`
                    }`}
                    key={cat.id}
                  >
                    <p
                      className="text-capitalize m-4 text-truncate categoryColor font"
                      style={{ direction: language === "en" ? "ltr" : "rtl" }}
                    >
                      {cat.name}
                    </p>
                  </Link>
                );
              })}
            <Link to={`/${username}/template/2/home`} className="w-100">
              <p className="text-capitalize categoryColor font">
                {language === "en" ? "More" : "المزيد"}
              </p>
            </Link>
          </div>

          <div
            className="right"
            style={{
              width: "calc(100% - 50px)",
              position: "relative",
              minHeight: "calc(100vh - 70px)",
            }}
          >
            <div
              style={{
                textDecoration: "none",
                color: "#111",
                // backgroundColor: "",
                fontSize: "30px",
                padding: "5px 10px",
                borderRadius: "5px",
                display: "inline-block",
                cursor: "pointer",
              }}
              className="color"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack />
            </div>

            <div className="categories mt-0" style={{ gap: "0px" }}>
              {pending ? (
                <p className="text-center mt-5 color">
                  <Spinner
                    className="m-auto"
                    animation="border"
                    // variant="primary"
                  />
                </p>
              ) : subCat.length >= 1 ? (
                subCat.map((sub) => {
                  return (
                    <Link
                      to={
                        sub.content === 1
                          ? `/${username}/template/2/category/${sub.id}`
                          : `/${username}/template/2/category/${id}/sub-category/${sub.id}`
                      }
                      key={sub.id}
                      className="temp2_sub_a"
                    >
                      <div className="category mb-3 mx-2">
                        <img
                          src={sub.image}
                          alt="category"
                          className="template2 ml-0 mr-0 p-0"
                          style={{
                            boxShadow:adminDetails.is_sub_move?'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.6) 0px 18px 36px -18px inset':'',
                            // height:adminDetails.is_sub_move?'1%':'',
                            minWidth: "150px",
                            maxWidth: "150px",
                            height: "150px",
                            borderRadius: "12px",
                            objectFit: "cover",
                            aspectRatio: 1,
                          }}
                        />
                        <p
                          className="template2_paragraph text-truncate text-capitalize w-100  subCatColor font"
                          style={{
                            direction: language === "en" ? "ltr" : "rtl",
                          }}
                        >
                          {sub.name}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h5 className="mt-5"></h5>
              )}
            </div>
            {pageCountSub.current > 1 ? (
              <div
                className="pt-3"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Pagination
                  pageCount={pageCountSub.current}
                  onPress={onPress}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <SearchInput
        showModal={showModal}
        handleClose={handleClose}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        language={language}
      />
      <PlusButton />
    </div>
  );
};

export default SubCatTemp2;
