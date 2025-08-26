import { Link, useParams } from "react-router-dom";
import { Fragment, useContext, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import { Modal } from "react-bootstrap";
import { LanguageContext } from "../../../context/LanguageProvider";
import "./styleTemp6.css";
import "./styleBreadcrump.scss";
// import logo from "../../assets/orientLogo.png";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import { GrPrevious } from "react-icons/gr";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarTmp6 from "./NavBarTmp6";
import { useGetItems } from "../../../hooks/user/useGetItems";
import { useGetSubCat } from "../../../hooks/user/useGetSubCat";
import PlusButton from "../../../utils/user/PlusButton";
import Pagination from "../template1/Pagination";
import AddToCart from "../../../utils/user/AddToCart";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useMediaQuery } from "@uidotdev/usehooks";
import { FaWhatsapp } from "react-icons/fa";
const ItemsTemp6 = () => {
  const { username, id, id2 } = useParams();
  const { language } = useContext(LanguageContext);
  const { adminDetails } = useContext(AdminContext);

  const { categories } = useContext(CategoriesContext);
  const [showModalDetails, setShowModalDetails] = useState(null);

  const handleCloseModalDetails = () => setShowModalDetails(null);
  const handleShowModalDetails = (item) => setShowModalDetails(item);

  const {
    pending,
    isError,
    error,
    items,
    searchWord,
    setSearchWord,
    onPress,
    pageCountItems,
  } = useGetItems();
  const { subCat } = useGetSubCat();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 760px)");
  const isMobileTooSmallDevice = useMediaQuery("only screen and (max-width : 360px)");
  const isMobileSmallDevice = useMediaQuery("only screen and (max-width : 390px)");
  const isMobileMediumDevice = useMediaQuery("(min-width: 400px) and (max-width: 500px)");
  // const handleUpdateUsername = () => {
  //   updateUsername(username);
  // };
  // useEffect(() => {
  //   handleUpdateUsername();
  // }, []);

  let selectedItem = "";
  let subSelected = "";
  const getItemById = (id) => {
    const parsedId = parseInt(id, 10); // Parse id to a number
    return categories?.find((item) => item.id === parsedId);
  };
  const getSubItemById = (id) => {
    const parsedId = parseInt(id, 10); // Parse id to a number
    return subCat?.find((item) => item.id === parsedId);
  };

  selectedItem = getItemById(id);
  subSelected = getSubItemById(id2);
  
  const imageUrl = `${showModalDetails?.image}`;
  const whatsappNumber = adminDetails?.whatsapp_phone;

  const shareOnWhatsApp = () => {
    if (whatsappNumber) {
      const message = `Check out this item: ${showModalDetails.name} - ${imageUrl}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        ...(adminDetails?.background_image_category  && adminDetails?.image_or_color
          ? {
              backgroundImage: `url(${adminDetails?.background_image_item})`,
              backgroundSize: "cover", // Ensures the image covers the entire background
              backgroundPosition: "bottom", // Centers the image
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
      <NavBarTmp6 searchWord={searchWord} setSearchWord={setSearchWord} />

      <nav>
        <ol className="breadcrumb-list">
          <li className="breadcrumb_item">
            <span
              className="previous"
              style={{
                color: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
                padding: "0 10px",
              }}
            >
              <GrPrevious />
            </span>
            <Link to={`/${username}/template/6/categories`} className="font">
              {language === "ar" ? "الرئيسية" : "Home"}{" "}
            </Link>
          </li>

          {id2 === "0" ? (
            <li className="breadcrumb_item active font">
              {" "}
              {selectedItem && selectedItem.name}
            </li>
          ) : (
            <Fragment>
              <li className="breadcrumb_item">
                <Link
                  to={`/${username}/template/6/categories/${id}`}
                  className="font"
                >
                  {selectedItem && selectedItem.name}
                </Link>
              </li>
              <li className="breadcrumb_item active font">
                {" "}
                {subSelected && subSelected.name}
              </li>
            </Fragment>
          )}
        </ol>
      </nav>

      {isError && (
        <h3 className="text-center text-light mt-5 font">
          {error?.data?.message}
        </h3>
      )}

      {pending && (
        <p className="w-100 text-center mt-5">
          <div className="spinner-border color" role="status">
            <span className="sr-only"></span>
          </div>
        </p>
      )}

      <div
        className="d-flex flex-column"
        style={{
          minHeight: "calc(100vh - 122px)",
        }}
      >
        <div className="orient_items_container">
          {items &&
            items.length > 0 &&
            items
            .map((item) => (
              <div
                key={item.id}
                className="orient_item"
                style={{
                  // backgroundColor: `#${
                  //   adminDetails &&
                  //   adminDetails.color &&
                  //   adminDetails.color.substring(10, 16)
                  // }`,
                  position:'relative',
                  overflow:'hidden'
                }}
                onClick={() => handleShowModalDetails(item)}
              >
                {/* Background layer */}
                <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `#${
                        adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                      }`,
                      opacity: adminDetails?.sub_opacity??adminDetails?.sub_opacity, 
                      zIndex: 1, // Place behind content
                      pointerEvents: "none", // Prevent cursor issues
                    }}
                  ></div>
                   <div
                    style={{
                      position: "relative", // Make sure the content is above the background
                      zIndex: 2,
                    }}
                  >
                <LazyLoadImage
                  src={item.image}
                  alt="image"
                  width={"100%"}
                  height={"100%"}
                  className=""
                  effect="blur"
                />
                <div className="orient_details">
                  <p
                    className="itemColor font"
                    style={{ direction: language === "en" ? "ltr" : "rtl",
                      fontFamily: adminDetails?.font_category,
                      fontSize:`${adminDetails.font_size_category}em`??'',
                      fontWeight:adminDetails?.font_bold_category?'bold':'none',
                     }}
                  >
                    {/* {item.name} */}
                    {localStorage.getItem('language')=="en"?item.name_en:item.name_ar}
                  </p>
                    <p className="itemColor font">
                    {`${(item && item.price) } ${adminDetails.price_type=='syrian'?'S.P':'$'}`}
                    </p>
                </div>
                </div>
              </div>
            ))}
        </div>
        {pageCountItems.current > 1 ? (
          <div
            className="py-1 m-auto"
            style={{ flex: "1", display: "flex", alignItems: "end" }}
          >
            <Pagination pageCount={pageCountItems.current} onPress={onPress} />
          </div>
        ) : null}
      </div>

      <PlusButton />

      {showModalDetails && (
        <Modal
          show={showModalDetails}
          onHide={handleCloseModalDetails}
          centered
          size="lg"
          dialogClassName="orient_dialog_item_details"
        >
          <Modal.Body className="p-0">
            <div className="card orient_card position-relative">
              <img
                src={showModalDetails && showModalDetails.image}
                alt="image"
                className="card_image"
              />
                {whatsappNumber && adminDetails?.share_item_whatsapp==1 && (
                    <button
                      onClick={shareOnWhatsApp}
                      style={{
                        position: "absolute",
                        bottom: "25%",
                        right: "8px",
                        backgroundColor: "#25D366",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}>
                        <FaWhatsapp size={20} />
                      </button>
                    )}
              <span className="previous" onClick={handleCloseModalDetails}>
                <GrPrevious />
              </span>

              {/* <div className="card-body">
                <h5
                  className="card-title font"
                  style={{
                    color: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                  }}
                >
                  {showModalDetails && showModalDetails.name}
                </h5>
                <p className="card-text font">
                  {showModalDetails && showModalDetails.description}
                </p>
                <h5
                  className="card-title font"
                  style={{
                    color: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                  }}
                >
                  {showModalDetails.price}
                </h5>
                  {showModalDetails?.adds?.length>1 &&
                        <AddToCart data={showModalDetails} />}

              </div> */}
              {showModalDetails?.adds && showModalDetails?.adds?.length > 0 && (
                    <div
                    style={{
                      display:'flex',
                      justifyContent:'center',
                      alignItems:'center',
                      margin:'auto',
                      textAlign:'center',
                      width:isMobileTooSmallDevice?'105%':isMobileSmallDevice?'78%'
                      :isMobileMediumDevice?'78%':'80.5%'
                    }}
                    >
                    <Swiper
                      navigation={true}
                      modules={[Navigation]}
                      spaceBetween={40}
                      style={{
                        "--swiper-navigation-color": "#000",
                        "--swiper-navigation-size": "20px",
                      }}
                    >
                      {showModalDetails?.adds?.map((e, index) => (
                        <SwiperSlide
                          key={index}
                        >
                            
                          <AddToCart data={e} itemImage={showModalDetails.image} />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                   </div>
                    )}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ItemsTemp6;
