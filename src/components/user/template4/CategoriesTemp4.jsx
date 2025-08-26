import { useContext, useEffect } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { Link } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const CategoriesTemp4 = ({ username }) => {
  const { categories, pageCount } = useContext(CategoriesContext);
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    updateUsername(username);
  }, [username, updateUsername]);

  const onPress = (page) => {
    // this function must exist for Pagination
    // make sure to connect it if needed in parent context
    console.log("Page pressed:", page);
  };
  useEffect(()=>{
    console.log('temp4',categories)
  },[categories])

  return (
    <div className="d-flex flex-col items-center justify-center">
      <div className="offers_temp4 mb-[54px]">
        {categories?.length > 0 &&
          categories.map((cat) => (
            <Link
              to={
                cat.content === 0
                  ? ""
                  : cat.content === 1
                  ? `/${username}/template/4/category/${cat.id}`
                  : `/${username}/template/4/category/${cat.id}/sub-category/0`
              }
              key={cat.id}
            >
              <div className="offer_temp4 relative overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `#${
                      adminDetails?.color?.substring(10, 16) || "ffffff"
                    }`,
                    opacity: adminDetails?.sub_opacity ?? 1,
                    zIndex: 1,
                  }}
                />
                <div className="relative z-[2]">
                  <LazyLoadImage
                    src={cat.image}
                    alt="category"
                    effect="blur"
                    className="shadow-lg"
                  />
                  <p
                    className="categoryColor font capitalize"
                    style={{
                      direction: language === "en" ? "ltr" : "rtl",
                      fontFamily: adminDetails?.font_category,
                      fontSize: `${adminDetails?.font_size_category}em`,
                      fontWeight: adminDetails?.font_bold_category ? "bold" : "normal",
                    }}
                  >
                    {localStorage.getItem("language") === "en"
                      ? cat.name_en
                      : cat.name_ar}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {pageCount.current > 1 && (
        <div className="pt-3 pb-5 flex flex-1 items-end">
          <Pagination pageCount={pageCount.current} onPress={onPress} />
        </div>
      )}
    </div>
  );
};

export default CategoriesTemp4;
