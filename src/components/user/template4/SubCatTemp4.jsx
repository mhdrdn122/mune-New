import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Spinner } from "react-bootstrap";
import Pagination from "../template1/Pagination";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetSubCatsQuery } from "../../../redux/slice/user section/subCatsApi";
import PlusButton from "../../../utils/user/PlusButton";
import Footer from "./Footer";

const SubCatTemp4 = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language } = useContext(LanguageContext);
  const { id, username } = useParams();

  const [subCat, setSubCat] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);

  const pageCountSub = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    updateUsername(username);
  }, [username, updateUsername]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchWord]);

  const {
    data: subCategories,
    isError,
    isSuccess,
    error,
    isFetching: pending,
  } = useGetSubCatsQuery(
    {
      resId: adminDetails?.id,
      catId: id,
      word: debouncedSearch,
      page,
      language,
    },
    { skip: !get }
  );

  useEffect(() => {
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      setGet(true);
    }
  }, [adminDetails]);

  useEffect(() => {
    if (!pending && isSuccess) {
      setSubCat(subCategories.data);
      pageCountSub.current = subCategories.meta.total_pages;
    }
  }, [pending, isSuccess, subCategories]);

  const handleClick = (sub) => {
    const path =
      sub.content === 1
        ? `/${username}/template/4/category/${sub.id}`
        : `/${username}/template/4/category/${id}/sub-category/${sub.id}`;
    navigate(path);
  };

  const onPress = (page) => setPage(page);

  return (
    <div
      style={{
        minHeight: "100vh",
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

      {isError && (
        <h3 className="w-100 text-center mt-5">
          {error?.data?.message}
        </h3>
      )}

      <div className="bottom_section_temp4 flex flex-col">
        {pending ? (
          <p className="w-100 text-center mt-5">
            <Spinner className="m-auto" animation="border" variant="dark" />
          </p>
        ) : (
          <div className="offers_temp4 pt-5">
            {subCat.map((sub) => (
              <div
                key={sub.id}
                className="offer_temp4_sub relative overflow-hidden"
                onClick={() => handleClick(sub)}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `#${adminDetails?.color?.substring(10, 16)}`,
                    opacity: adminDetails?.sub_opacity ?? 1,
                    zIndex: 1,
                  }}
                />
                <div className="relative z-10">
                  <LazyLoadImage
                    src={sub.image}
                    alt="subCat"
                    width="100%"
                    height="100%"
                    effect="blur"
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.35)",
                    }}
                  />
                  <h5
                    className="subCatColor font text-break text-center p-2 text-capitalize mb-0 w-100"
                    style={{
                      direction: language === "en" ? "ltr" : "rtl",
                      display: "inline-block",
                      padding: "100px",
                      textAlign: "center",
                      width: "fit-content",
                      minWidth: "50%",
                      fontFamily: adminDetails?.font_category,
                      fontSize: `${adminDetails?.font_size_category}em`,
                      fontWeight: adminDetails?.font_bold_category ? "bold" : "normal",
                      boxShadow: adminDetails?.is_sub_move
                        ? "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
                        : "",
                      borderRadius: adminDetails?.is_sub_move ? "10px" : "",
                    }}
                  >
                    {localStorage.getItem("language") === "en" ? sub.name_en : sub.name_ar}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        )}

        {pageCountSub.current > 1 && (
          <div className="mb-2 m-auto flex flex-1 items-end">
            <Pagination pageCount={pageCountSub.current} onPress={onPress} />
          </div>
        )}
      </div>

      <Footer />
      <PlusButton />
    </div>
  );
};

export default SubCatTemp4;
