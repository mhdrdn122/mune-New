import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Link, useParams } from "react-router-dom";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import CategoriesContainer from "./CategoriesContainer";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { Form, Modal } from "react-bootstrap";
import axios from "axios";
import { LanguageContext } from "../../../context/LanguageProvider";
import Cover from "../template1/Cover";
import NavBarUser from "../../../utils/user/NavBarUser";
import SearchInput from "../../../utils/user/SearchInput";
import baseURLTest from "../../../Api/baseURLTest";
import PlusButton from "../../../utils/user/PlusButton";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";

const Categories = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const [showModal, setShowModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const { username } = useParams();
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const onChangeSearch = (e) => {
    setSearchWord(e.target.value);
  };

  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  useEffect(() => {
    async function getProduct(word) {
      try {
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
        pageCount.current = response.data.meta.total_pages;
        setCategories(response.data.data);
      } catch (e) {
        console.log(e);
      }
    }
    setTimeout(() => {
      if (Object.keys(adminDetails).length > 0) {
        getProduct(searchWord);
      }
    }, 1000);
  }, [searchWord, adminDetails]);

  return (
    <div style={{ minHeight: "calc(100vh + 54px)" }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      {
        <Cover />
        // <div
        //   className="banner"
        //   // style={{ width: "calc(100%)", marginLeft: "auto" }}
        // >
        //   <Link
        //     to={adminDetails.cover}
        //   >
        //     <img
        //       src={adminDetails.cover}
        //       alt=""
        //       style={{ minWidth: "350px", minHeight: "200px" }}
        //     />
        //   </Link>
        // </div>
      }
      <div className="right pt-0">
        <div className="mt-3 mb-0">
          <AdvertismentSlider num={1} />
        </div>

        <div className="offers px-0">
          <CategoriesContainer username={username} />

          <SearchInput
            showModal={showModal}
            handleClose={handleClose}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            language={language}
          />
        </div>
        <SidebarBottom adminDetails={adminDetails} />
      </div>
    </div>
  );
};

export default Categories;
