import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import AdvertismentSlider from "../template1/AdvertismentSlider";
import CategoriesTemp4 from "./CategoriesTemp4";
import { LanguageContext } from "../../../context/LanguageProvider";
import Cover from "../template1/Cover";
import NavBarUser from "../../../utils/user/NavBarUser";
import baseURLTest from "../../../Api/baseURLTest";
import { SidebarBottom } from "../../../utils/user/SidebarBottom";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { setCategories } = useContext(CategoriesContext);
  const { language } = useContext(LanguageContext);
  const { username } = useParams();

  const [searchWord, setSearchWord] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  useEffect(() => {
    updateUsername(username);
  }, [username]);

  useEffect(() => {
    if (Object.keys(adminDetails).length === 0) return;

    const timer = setTimeout(() => {
      if (searchWord !== "" || hasSearchedOnce) {
        fetchCategories(searchWord);
        setHasSearchedOnce(true);
      }
    }, 1000);

    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, [searchWord, adminDetails]);

  const fetchCategories = async (word) => {
    setPending(true);
    setError("");
    setCategories([]);

    try {
      const config = { headers: { language } };
      const res = await baseURLTest.get(
        `/customer_api/show_restaurant_categories?restaurant_id=${adminDetails?.id}&page=&search=${word}`,
        config
      );
      setCategories(res.data.data);
    } catch (e) {
      setCategories([]);
      setError(e.response?.data?.message || "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 54px)",
        ...(adminDetails?.background_image_category && adminDetails?.image_or_color
          ? {
              backgroundImage: `url(${adminDetails.background_image_category})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {
              backgroundColor: `#${adminDetails?.background_color?.substring(10, 16)}`,
            }),
      }}
      className="bgColor"
    >
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
      <Cover />

      <div
        className="bottom_section_temp4 mt-5"
        style={{
          flexDirection: language === "en" ? "row" : "row-reverse",
          minHeight: "calc(100vh - 276px)",
        }}
      >
        <div className="right_section_temp4 w-100">
          <AdvertismentSlider num={1} />

          {error && (
            <h3 className="text-center text-dark mt-5">
              {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}
            </h3>
          )}

          {pending && (
            <p className="w-100 text-center mt-5">
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </p>
          )}

          <CategoriesTemp4 username={username} />
          <SidebarBottom adminDetails={adminDetails} />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
