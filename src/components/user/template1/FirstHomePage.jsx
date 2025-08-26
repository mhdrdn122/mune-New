import { Fragment, useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
// import facebook from "../../assets/pngegg.png";
// import whatss from "../../../assets/User/واتس.png";
import whatss from "../../../assets/User/واتس.png";
import { AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Button, Spinner } from "react-bootstrap";
// import notFound from "../../../assets/User/pngegg(14).png";
import { UserContext } from "../../../context/UserProvider";
import levantLogo from "../../../assets/User/lev.jpg";
import "animate.css";
import { TypeAnimation } from "react-type-animation";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import notify from "../../../utils/useNotification";
import { LanguageContext } from "../../../context/LanguageProvider";
import LoginUserModal from "../../../utils/user/LoginUserModal";

const FirstHomePage = () => {
  const { adminDetails, updateUsername, loading, updateTableId, error } =
    useContext(AdminContext);
  const { userToken, setUserToken } = useContext(UserContext);
  const navigate = useNavigate();
  const { username, table_id } = useParams();
  const isTakeout = window.location.pathname.includes("/takeout");
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  const { language } = useContext(LanguageContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  useEffect(() => {
    if (isTakeout) {
      updateUsername(username, true); // Indicate takeout scenario
      localStorage.removeItem("tableId"); // Ensure no table ID is stored
      localStorage.removeItem("userToken");
      // setUserToken('')
      localStorage.setItem("isTakeout", isTakeout);
      if (!userToken && isTakeout) {
        // setShowLoginModal(true);
        navigate(`/${username}/takeout/register`);
        notify(
          language == "en"
            ? "please login or Register"
            : "الرجاء تسجيل الدخول مرة أخرى",
          "warn"
        );
        return;
      }
    } else {
      handleUpdateUsername();
      if (table_id !== undefined) {
        updateTableId(table_id);
        localStorage.setItem("tableId", table_id);
        // localStorage.removeItem('isTakeout')
      }
    }
  }, [username, table_id, isTakeout]);

  useEffect(() => {
    localStorage.removeItem("tableId");
    localStorage.removeItem("heSaidNo");
    localStorage.removeItem("isTakeout");
    if (table_id) {
      localStorage.setItem("tableId", table_id);
    }
    if (isTakeout) {
      localStorage.setItem("isTakeout", isTakeout);
    }
  }, []);
  console.log(adminDetails?.message_in_home_page);

  useEffect(
    () => console.log("admin info from first page", adminDetails),
    [adminDetails]
  );

  console.log(adminDetails);
  return (
    <>
      <div
        className="bgColor"
        style={{
          minHeight: "100vh",
          ...(adminDetails?.background_image_home_page &&
          adminDetails?.image_or_color
            ? {
                backgroundImage: `url(${adminDetails?.background_image_home_page})`,
                backgroundSize: "cover", // Ensures the image covers the entire background
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat", // Prevents tiling
              }
            : {
                backgroundColor: `#${
                  adminDetails &&
                  adminDetails?.background_color &&
                  adminDetails?.background_color?.substring(10, 16) // Fallback to white
                }`,
              }),
        }}
      >
        {loading === false ? (
          adminDetails && Object.keys(adminDetails).length > 0 ? (
            <Fragment>
              <div className="banner">
                <Link to={adminDetails.cover}>
                  <LazyLoadImage
                    src={adminDetails.cover}
                    alt=""
                    width={"100%"}
                    height={"100%"}
                    effect="blur"
                  />
                </Link>
              </div>
              <div className="Details_home_page">
                {/* <span className="text-3xl md:text-4xl my-5 p-0">{adminDetails?.message_in_home_page || "welcome to Restaurant"}</span> */}

                <Link to={`/${username}`}>
                  <LazyLoadImage
                    src={`${adminDetails.logo_home_page}`}
                    alt=""
                    effct="blur"
                    // className="animate__animated animate__fadeInUp animate__slower-2s"
                    style={{
                      borderRadius:
                        adminDetails.logo_shape === 1 ||
                        !adminDetails.logo_shape
                          ? "50%"
                          : "0%",
                      width: adminDetails.logo_shape === 2 ? "300px" : "150px", // Rectangle width
                      height: adminDetails.logo_shape === 2 ? "150px" : "150px", // Rectangle height for logo_shape 2
                      ...(adminDetails.logo_shape === 3 && {
                        width: "150px",
                        height: "150px",
                      }), // Square shape
                    }}
                  />
                </Link>

                {adminDetails && adminDetails.menu_template_id && (
                  <Link
                    to={`/${username}/template/${adminDetails.menu_template_id}/home`}
                  >
                    <button
                      style={{
                        backgroundColor: `#${
                          adminDetails &&
                          adminDetails.color &&
                          adminDetails.color.substring(10, 16)
                        }`,
                        opacity: adminDetails.home_opacity || 1,
                      }}
                      className="font"
                    >
                      NEXT
                    </button>
                  </Link>
                )}
              </div>
            </Fragment>
          ) : (
            <div className=" h-100">
              <div className="alert alert-primary mb-5" role="alert">
                {error?.message}
              </div>
              <img
                src={"../../../assets/User/pngegg(14).png"}
                className=" w-100 h-75"
              />
            </div>
          )
        ) : (
          <div className="d-flex align-items-center justify-content-center vh-100">
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <Button variant="primary" disabled>
              Loading...
            </Button>
          </div>
        )}
      </div>
      <LoginUserModal
        show={showLoginModal}
        handleClose={handleCloseLoginModal}
      />
    </>
  );
};

export default FirstHomePage;
