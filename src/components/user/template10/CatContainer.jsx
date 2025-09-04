import { useContext, useEffect } from "react";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { Link, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const CatContainer = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { categories, setCategories } = useContext(CategoriesContext);
  const { language } = useContext(LanguageContext);
  const { username } = useParams();

  useEffect(() => {
    console.log(categories);
  }, [categories]);
  useEffect(() => {
    updateUsername(username);
  }, [updateUsername, username]);
   return (
    <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-2 p-1">
      {categories?.map((cat) => {
        const path = `/${username}/template/${adminDetails?.menu_template_id}/category/${cat.id}`;
        return (
          <Link to={path} key={cat.id} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: `#${adminDetails?.color?.substring(10, 16)}`,
                display: "flex",
                flexDirection: "column",
                width: "175px",
                borderRadius: "20px",
                padding: "10px",
                paddingBottom: "50px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                height: "250px",
                border: "1px solid #000",
                // background:"red"
              }}
            >
              <LazyLoadImage
                src={cat.image}
                alt="category"
                className="w-full h-[150px] rounded-2xl self-center"
                effect="blur"
              />
              <p className="categoryColor text-center text-2xl font-[20px]">
                {language === "en" ? cat?.name_en : cat?.name_ar}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CatContainer;
