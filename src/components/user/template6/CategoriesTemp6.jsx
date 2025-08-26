import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import "./styleTemp6.css";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import Search from "./Search";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarTmp6 from "./NavBarTmp6";
import baseURLTest from "../../../Api/baseURLTest";
import PlusButton from "../../../utils/user/PlusButton";
import Pagination from "../template1/Pagination";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";

const CategoriesTemp6 = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [firstLoad, setFirstLoad] = useState(true);
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const [searchWord, setSearchWord] = useState("");
  const [showInputSearch, setShowInputSearch] = useState(false);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const onChangeSearch = (e) => {
    setSearchWord(e.target.value);
  };
  // const handleClose = () => setShowModal(false);
  // const handleShow = () => setShowModal(true);

  const handleToggleInputSearch = () => {
    setShowInputSearch(!showInputSearch);
  };

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
      setCategories([]);
      setError("");
      const config = {
        headers: {
          language: language,
        },
      };
      // const response = await axios.get(
      //   `https://api.menu.sy/user_api/show_admin_categories?adminId=${adminDetails.id}&search=${word}`,
      //   config
      // );
      const response = await baseURLTest.get(
        `/customer_api/show_restaurant_categories?restaurant_id=${
          adminDetails && adminDetails.id
        }&page=${1}&search=${word}`,
        config
      );
      console.log(response);
      setCategories(response.data.data);
      pageCount.current = response.data.meta.total_pages;
      setError("");
    } catch (e) {
      setCategories([]);
      setError(e.response.data.message);
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    // if (searchWord === "") {
    //   getProduct("");
    // }
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      const timer = setTimeout(() => {
        if (Object.keys(adminDetails).length > 0) {
          getProduct(searchWord);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [language, adminDetails, searchWord]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (Object.keys(adminDetails).length > 0) {
  //       if (searchWord !== "") {
  //         getProduct(searchWord);
  //       }
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [searchWord]);

  const onPress = async (page) => {
    const config = {
      headers: {
        language: language,
      },
    };
    // const response = await axios.get(
    //   `https://api.menu.sy/user_api/show_admin_categories?adminId=${
    //     adminDetails && adminDetails.id
    //   }&page=${page}`,
    //   config
    // );
    const response = await baseURLTest.get(
      `/customer_api/show_restaurant_categories?restaurant_id=${
        adminDetails && adminDetails.id
      }&page=${page}&search=${searchWord}`,
      config
    );
    // console.log(response.data.data);
    setCategories(response.data.data);
  };

  const StatusOfSubAndItem = Object.freeze({
    0: "No_Sub_No_Item",
    1: "There_Is_Sub",
    2: "There_Is_Item",
  });

  const url = (cat) => {
    const status = StatusOfSubAndItem[cat && cat.content];
    const urlMap = {
      There_Is_Sub: `/${username}/template/6/categories/${cat && cat.id}`,
      There_Is_Item: `/${username}/template/6/categories/${
        cat && cat.id
      }/sub-category/0`,
    };

    return urlMap[status] || "";
  };

  console.log(showInputSearch);

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "DIN",
        fontWeight: "bold",
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

      <div className="">
        <AdvertismentSlider num={1} />
      </div>

      {error && (
        <h3 className="text-center text-light mt-5">
          {" "}
          {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}{" "}
        </h3>
      )}

      {/* {pending && (
        <p className="w-100 text-center mt-5">
          <div className="spinner-border color" role="status">
            <span className="sr-only"></span>
          </div>
        </p>
      )} */}

      <div
        className="d-flex flex-column"
        style={{
          minHeight: "calc(100vh - 425px)",
        }}
      >
        <div className="orient_cats_container">
          {categories &&
            categories.length > 0 &&
            categories  
            .map((cat) => {
              return (
                <Link
                  to={url(cat)}
                  key={cat.id}
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
                    className="categoryColor font"
                    style={{ direction: language === "en" ? "ltr" : "rtl",
                      fontFamily: adminDetails?.font_category,
                      fontSize:`${adminDetails.font_size_category}em`??'',
                      fontWeight:adminDetails?.font_bold_category?'bold':'none',
                     }}
                  >
                    {localStorage.getItem('language')=="en"?cat.name_en:cat.name_ar}
                    {/* {cat.name} */}
                  </p>
                </Link>
              );
            })}
        </div>

        {pageCount.current > 1 ? (
          <div
            className="pb-5 m-auto"
            style={{ flex: "1", display: "flex", alignItems: "end" }}
          >
            <Pagination pageCount={pageCount.current} onPress={onPress} />
          </div>
        ) : null}
      </div>

      {/* <Search
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        language={language}
      /> */}
      <SidebarBottom adminDetails={adminDetails} />
    </div>
  );
};

export default CategoriesTemp6;
