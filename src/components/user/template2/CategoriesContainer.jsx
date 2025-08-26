import { useContext } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import baseURLTest from "../../../Api/baseURLTest";

const CategoriesContainer = ({ username }) => {
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  console.log(pageCount.current);

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


  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: categories?.length < 5 ? categories?.length : 5,
    slidesToScroll: 5,
    autoplay: false,
    autoplaySpeed: 2000,
    waitForAnimate: true,
    adaptiveHeight: true,
    responsive: [
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
          rows: 3,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <div className="d-flex flex-column align-items-center justify-content-center ">
      <div className="categories cat_temp2">
        {categories?.map((cat) => {
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
              className="a_temp1"
            >
              <div className="category mb-2">
                <LazyLoadImage
                  src={cat.image}
                  alt="category"
                  className="template2 ml-0 mr-0 p-0"
                  effect="blur"
                />
                <p className="template2_paragraph categoryColor font ">
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

export default CategoriesContainer;
