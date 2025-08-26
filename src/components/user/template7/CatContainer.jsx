import React, { useContext, useEffect } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import { baseURLPublicName } from "../../../Api/baseURL";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";

const CatContainer = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const { language } = useContext(LanguageContext);

  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const onPress = async (page) => {
    const config = {
      headers: {
        language: language,
      },
    };
    const response = await axios.get(
      `https://api.menu.sy/user_api/show_admin_categories?adminId=${adminDetails.id}&page=${page}`,
      config
    );
    setCategories(response.data.data);
  };
  return (
    <div className=" w-full">
      <div
        className="flex flex-wrap w-full justify-center items-center gap-10 mb-10"
        style={{
          flexDirection: language === "en" ? "row" : "row-reverse",
        }}
      >
        {categories?.map((cat) => {
          return (
            <Link
              to={`${
                cat.content === 0
                  ? ""
                  : cat.content === 1
                  ? `/${username}/template/7/category/${cat.id}`
                  : `/${username}/template/7/category/${cat.id}/sub-category/0`
              }`}
              key={cat.id}
              style={{ textDecoration: "none" }}
            >
              <div 
                style={{
                background: `#${adminDetails?.color?.substring(10, 16)}`,
                display:"flex",
                flexDirection:"column",
                width:"175px",
                borderRadius:"20px",
                padding:"10px",
                paddingBottom:"50px",
                justifyContent:"center",
                alignItems:"center",
                gap:"10px",
                height:"250px"
              }}
            >
              <LazyLoadImage
                src={cat.image}
                alt="category"
                className="w-full h-[150px] rounded-2xl self-center"
                effect="blur"
              />
              <p className="categoryColor text-center text-2xl font-[20px]">
                {
                  language === "en" ? cat?.name_en : cat?.name_ar
                }
              </p>
            </div>
            </Link>
          );
        })}
      </div>
      {pageCount.current > 1 ? (
        <div className="pt-3 mb-5">
          <Pagination pageCount={pageCount.current} onPress={onPress} />
        </div>
      ) : null}
    </div>
  );
};

export default CatContainer;
