import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
 import { Link, useParams } from "react-router-dom";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import CategoriesSection from "./CategoriesSection";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import Cover from "../template1/Cover";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import Search from "../template6/Search";
import NavBarUser from "../../../utils/user/NavBarUser";
import baseURLTest from "../../../Api/baseURLTest";
import PlusButton from "../../../utils/user/PlusButton";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";

const Home = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [searchWord, setSearchWord] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [shouldFetchAllCategories, setShouldFetchAllCategories] =
    useState(false);
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const onChangeSearch = (e) => {
    setSearchWord(e.target.value);
  };
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
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
        // const response = await axios.get(
        //   `https://api.menu.sy/user_api/show_admin_categories?adminId=${
        //     adminDetails && adminDetails.id
        //   }&search=${word}`,
        //   config
        // );
        const response = await baseURLTest.get(
          `/customer_api/show_restaurant_categories?restaurant_id=${
            adminDetails && adminDetails.id
          }&search=${word}`,
          config
        );
        console.log(response);
        setCategories(response.data.data);
        setError("");
      } catch (e) {
        setCategories([]);
        setError(e.response.data.message);
      } finally {
        setPending(false);
      }
    }
    const timer = setTimeout(() => {
      if (Object.keys(adminDetails).length > 0) {
        if (searchWord !== "") {
          getProduct(searchWord);
          setShouldFetchAllCategories(true);
        } else {
          if (shouldFetchAllCategories) {
            getProduct(searchWord);
          }
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchWord, adminDetails]);

  return (
    <div style={{ minHeight: "calc(100vh + 54px)", 
    background: "" }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      {
        <Cover />
        // <div className="banner">
        //   {
        //     <Link
        //     to={adminDetails.cover}
        //   >
        //     <img
        //       src={adminDetails.cover}
        //       alt="ar"
        //     />
        //     </Link>
        //     // <img src={img1} alt="ar" />
        //   }
        // </div>
      }

      <div className="">
        <AdvertismentSlider num={1} />

        {error && (
          <h3 className="text-center text-dark mt-5">
            {" "}
            {language === "en" ? "Not Found Data" : "لا يوجد عناصر"}{" "}
          </h3>
        )}

        {pending && (
          <p className="w-100 text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
          </p>
        )}

        <CategoriesSection username={username} />

        <SidebarBottom adminDetails={adminDetails} />
      </div>
    </div>
  );
};

export default Home;
