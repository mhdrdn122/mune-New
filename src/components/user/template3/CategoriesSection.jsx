import React, { useContext } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Pagination from "../template1/Pagination";
// import test from "../../assets/_soft drinks_.png";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import baseURLTest from "../../../Api/baseURLTest";

const CategoriesSection = ({ username }) => {
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const { adminDetails } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

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
      }&page=${page}`,
      config
    );
    // console.log(response.data.data);
    setCategories(response.data.data);
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: categories?.length < 6 ? categories?.length : 6,
    slidesToScroll: 6,
    autoplay: false,
    speed: 500,
    // autoplaySpeed: 2000,
    cssEase: "linear",
    waitForAnimate: true,
    // adaptiveHeight: true,
    // pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          rows: 2,
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          rows: 2,
          // slidesPerRow: 2,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <div className="d-flex flex-column align-items-center justify-content-center ">
      <div className="categories_template3" style={{marginBottom:'54px'}}>
        {categories?.map((cat) => {
          return (
            <Link
            to={`${
              cat.content === 0
                ? ""
                : cat.content === 1
                ? `/${username}/template/3/category/${cat.id}`
                : `/${username}/template/3/category/${cat.id}/sub-category/0`
            }`}
              key={cat.id}
            >
              <div
                className="category"
                style={{
                  backgroundColor: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                }}
              >
                <LazyLoadImage
                  src={cat.image}
                  alt="category"
                  effect="blur"
                  width="100%"
                  className=""
                />
                <p
                  style={{ fontFamily: "Amiri" }}
                  className="p-2 text-center 
                  categoryColor font text-capitalize w-100 font-weight-bold "
                >
                  {cat.name}
                </p>
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

export default CategoriesSection;
