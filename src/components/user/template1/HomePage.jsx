import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import baseURLTest from "../../../Api/baseURLTest";

import NavBarUser from "../../../utils/user/NavBarUser";
import SearchInput from "../../../utils/user/SearchInput";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";
import AdvertismentSlider from "./AdvertismentSlider";
import CategoriesSlider from "./CategoriesSlider";
import Cover from "./Cover";

import { AdminContext } from "../../../context/AdminProvider";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { LanguageContext } from "../../../context/LanguageProvider";

export default function HomePage() {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language } = useContext(LanguageContext);
  const { categories, setCategories, pageCount } = useContext(CategoriesContext);
  const { username } = useParams();

  const [searchWord, setSearchWord] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    updateUsername(username);
  }, [username]);

  const handleClose = () => setShowModal(false);

  const getProduct = async (word) => {
    try {
      setPending(true);
      setError("");
      setCategories([]);

      const config = { headers: { language } };
      const res = await baseURLTest.get(
        `/customer_api/show_restaurant_categories?restaurant_id=${adminDetails?.id}&search=${word}`,
        config
      );

      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "حدث خطأ ما");
      setCategories([]);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (!firstLoad) {
      const timer = setTimeout(() => getProduct(searchWord), 1000);
      return () => clearTimeout(timer);
    }
    setFirstLoad(false);
  }, [searchWord]);

  const backgroundStyle = adminDetails?.background_image_category && adminDetails?.image_or_color
    ? {
        backgroundImage: `url(${adminDetails.background_image_category})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {
        backgroundColor: `#${adminDetails?.background_color?.substring(10, 16) || "ffffff"}`,
      };

  return (
    <div
      className="bgColor"
      style={{ minHeight: "calc(100vh + 54px)", ...backgroundStyle }}
    >
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
      <Cover />
      <AdvertismentSlider num={1} />
      <CategoriesSlider
        categories={categories}
        setCategories={setCategories}
        pageCount={pageCount}
        username={username}
        error={error}
        pending={pending}
      />
      {/* <SearchInput
        showModal={showModal}
        handleClose={handleClose}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        language={language}
      /> */}
      <SidebarBottom adminDetails={adminDetails} />
    </div>
  );
}
