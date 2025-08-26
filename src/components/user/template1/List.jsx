import icon_home from "../../../assets/User/icon _home.png";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import Pagination from "./Pagination";
import {
  Button,
  Dropdown,
  Form,
  Modal,
  ModalBody,
  Spinner,
} from "react-bootstrap";
import { AdminContext } from "../../../context/AdminProvider";
 import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import { MdCancel } from "react-icons/md";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import SearchInput from "../../../utils/user/SearchInput";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useMediaQuery } from "@uidotdev/usehooks";
import baseURLTest from "../../../Api/baseURLTest";
import { IoIosHome } from "react-icons/io";
import PlusButton from "../../../utils/user/PlusButton";
import { useDispatch } from "react-redux";
import { addOrder } from "../../../redux/slice/user section/ordersSlice";
import AddToCart from "../../../utils/user/AddToCart";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
export default function List() {
  const [showModal, setShowModal] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsSimilar, setItemsSimilar] = useState();
  const [subCat, setSubCat] = useState([]);
  const [subCurrent, setSubCurrent] = useState("");
  const [subId, setSubId] = useState();
  const [pending, setPending] = useState(true);
  const pageCountItems = useRef();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [error, setError] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 480px)");
  const dispatch = useDispatch();

  const handleClose = () => setShowModal(null);
  const handleShow = (item) => {
    setShowModal(item);
    handleClickSimilarProject(item.id);
  };

  const isMobileTooSmallDevice = useMediaQuery(
    "only screen and (max-width : 360px)"
  );
  const isMobileSmallDevice = useMediaQuery(
    "only screen and (max-width : 390px)"
  );
  const isMobileMediumDevice = useMediaQuery(
    "(min-width: 400px) and (max-width: 500px)"
  );
  const handleCloseSearch = () => setShowModalSearch(false);
  const handleShowSearch = () => setShowModalSearch(true);

  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const [searchWord, setSearchWord] = useState("");
  const { username } = useParams();

  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, [username]);

  const { id } = useParams();
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const SubCateRef = useRef(0);

  const getItemById = (id) => {
    const parsedId = parseInt(id, 10); // Parse id to a number
    return categories?.find((item) => item.id === parsedId);
  };
  // let selectedItem = getItemById(id);
  let selectedItem = "";
  selectedItem = getItemById(id);

  const getProduct = async (word, subId) => {
    try {
      setPending(true);
      setItems([]);
      setError("");
      const config = {
        headers: {
          language: language,
        },
      };
      console.log(subId);

      const response = await baseURLTest.get(
        `/customer_api/show_items?category_id=${subId === "" ? id : subId}`,
        config
      );
      // console.log(response)
      setItems(response.data.data);
      pageCountItems.current = response.data.meta.total_pages;
      SubCateRef.current = subId;
      setError("");
    } catch (e) {
      console.log(e);
      setItems([]);
      setError(e.response.data.message);
    } finally {
      setPending(false);
    }
  };
  const getSubCat = async () => {
    try {
      const config = {
        headers: {
          language: language,
        },
      };
      const response = await baseURLTest.get(
        `/customer_api/show_restaurant_categories?restaurant_id=${
          adminDetails && adminDetails.id
        }&category_id=${id}`,
        config
      );
      // console.log(response.data.data[0].id);
      setSubCat(response.data.data);
      // setSubCurrent(response.data.data[0]);

      return response.data.data[0].id;
      // console.log(response.data.data[0])
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  useEffect(() => {
    const getData = async () => {
      await getSubCat().then((subId) => getProduct("", subId));
    };
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      getData();
    }
    window.scrollTo(0, 0);
    document.documentElement.style.setProperty(
      "--breadCrubm-Item-Before",
      `#${
        adminDetails &&
        adminDetails.color &&
        adminDetails.color.substring(10, 16)
      }`
    );
  }, [id, language, adminDetails]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      const timer = setTimeout(() => {
        getProduct(searchWord, subCat[0].id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchWord]);

  const handleClickSimilarProject = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItemsSimilar(filteredItems);
  };
  console.log(SubCateRef.current);

  const onPress = async (page) => {
    const config = {
      headers: {
        language: language,
      },
    };

    const response = await baseURLTest.get(
      `/customer_api/show_items?category_id=${
        SubCateRef.current === "" ? id : SubCateRef.current
      }&page=${page}`,
      config
    );
    // console.log(response.data.data);
    pageCountItems.current = response.data.meta.total_pages;
    setItems(response.data.data);
  };

  const handleClickSubCat = async (sub_id) => {
    try {
      setPending(true);
      setItems([]);
      SubCateRef.current = sub_id;
      setSubCurrent(subCat?.find((item) => item.id === sub_id));
      const config = {
        headers: {
          language: language,
        },
      };

      const response = await baseURLTest.get(
        `/customer_api/show_items?category_id=${sub_id}`,
        config
      );
      pageCountItems.current = response.data.meta.total_pages;
      setItems(response.data.data);
      setError("");
    } catch (error) {
      console.error(error);
      setItems([]);
      setError(error.response.data.message);
    } finally {
      setPending(false);
    }
  };
  const imageUrl = `${showModal?.image}`;
  const whatsappNumber = adminDetails?.whatsapp_phone;

  const shareOnWhatsApp = () => {
    if (whatsappNumber) {
      const message = `Check out this item: ${showModal.name} - ${imageUrl}`;
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
        ...(adminDetails?.background_image_category &&
        adminDetails?.image_or_color
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
      className="bgColor"
    >
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      <div
        className="headList "
        style={{
          marginLeft: language === "en" ? `${show ? "85px" : "0 "}` : ``,
          marginRight: language === "en" ? `` : `${show ? "85px" : "0 "}`,
          flexDirection: language === "en" ? "" : "row-reverse",
          justifyContent: language === "en" ? "" : "space-between",
          alignItems: isSmallDevice
            ? language === "en"
              ? "flex-start"
              : "flex-end"
            : "center",
        }}
      >
        {/* <div
          className="list_food "
          style={{
            background: `#${
              adminDetails &&
              adminDetails.color &&
              adminDetails.color.substring(10, 16)
            }`,
            borderRadius: language === "en" ? "0 20px 20px 0" : "20px 0 0 20px",
            flexDirection: language === "en" ? "row" : "row-reverse",
          }}
        >
          <Link className="list_menu" onClick={() => setShow(!show)}>
            <p></p>
            <p></p>
            <p></p>
          </Link>
          <p className="font"> {language === "en" ? "MENU" : "القائمة"} </p>
        </div> */}
        <nav
          className="bgColor"
          dir={language === "en" ? "ltr" : "rtl"}
          aria-label="breadcrumb"
          style={{
            alignSelf: isSmallDevice
              ? language === "en"
                ? "flex-start"
                : "flex-end"
              : "",
          }}
        >
          <ol
            className="breadcrumb"
            style={{
              backgroundColor: `#${
                adminDetails &&
                adminDetails.background_color &&
                adminDetails.background_color.substring(10, 16)
              }`,
            }}
          >
            <li
              className="breadcrumb-item"
              style={{ float: language === "en" ? "" : "" }}
            >
              <Link to={`/${username}/template/1/home`}>
                {/* <img src={icon_home} alt="" /> */}
                <IoIosHome
                  style={{
                    color: `#${
                      adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                    }`,
                    fontSize: isSmallDevice ? "25px" : "30px",
                  }}
                />
              </Link>
            </li>
            <li
              className="breadcrumb-item font"
              aria-current="page"
              style={{
                color: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              {selectedItem && selectedItem.name}
            </li>
            {subCurrent && (
              <li
                className="breadcrumb-item active font"
                aria-current="page"
                style={{
                  color: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                }}
              >
                {subCurrent.name}
              </li>
            )}
          </ol>
        </nav>
      </div>

      {error && (
        <h3 className="text-center mt-5 font">
          {" "}
          {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}{" "}
        </h3>
      )}

      {pending && (
        <p className="text-center mt-5">
          <Spinner className="m-auto color" animation="border" />
        </p>
      )}

      <div
        className="d-flex flex-column align-items-center justify-content-start"
        style={{ minHeight: "calc(100vh - 187px)" }}
      >
        <div
          className="meals"
          style={{
            marginLeft: language === "en" ? `${show ? "85px" : "0 "}` : ``,
            marginRight: language === "en" ? `` : `${show ? "85px" : "0 "}`,
            flexDirection: language === "en" ? "row" : "row-reverse",
          }}
        >
          {items && items.length > 0
            ? items.map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{ cursor: "pointer", heigth: "100%" }}
                  >
                    <div
                      className="meal"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        // background: `#${
                        //   adminDetails &&
                        //   adminDetails.color &&
                        //   adminDetails.color.substring(10, 16)
                        // }`,
                      }}
                      onClick={() => handleShow(item)}
                    >
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
                          opacity:
                            adminDetails?.sub_opacity ??
                            adminDetails?.sub_opacity,
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
                          alt="item"
                          effect="blur"
                          style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.35)",
                          }}
                        />
                        <div className="section_bottom">
                          <p
                            className="para mb-1 itemColor font"
                            style={{
                              direction: language === "en" ? "ltr" : "rtl",
                              fontFamily: adminDetails?.font_item,
                              fontSize:
                                `${adminDetails.font_size_item}em` ?? "",
                              fontWeight: adminDetails?.font_bold_item
                                ? "bold"
                                : "none",
                            }}
                          >
                            {localStorage.getItem("language") == "en"
                              ? item.name_en
                              : item.name_ar}
                            {/* {item.name} */}
                          </p>
                          {
                            <p
                              className="text-dark text-center font-weight-bold text-break w-100 m-0 font"
                              style={{
                                visibility:
                                  item && item.price ? "visible" : "hidden", // Keep space if no price
                              }}
                            >
                              {item && item.price
                                ? `${item.price} ${
                                    adminDetails?.price_type == "syrian"
                                      ? "S.P"
                                      : "$"
                                  }`
                                : "\u00A0"}
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        {pageCountItems.current > 1 ? (
          <div
            className="pb-2"
            style={{ flex: "1", display: "flex", alignItems: "end" }}
          >
            <Pagination pageCount={pageCountItems.current} onPress={onPress} />
          </div>
        ) : null}
      </div>

      <SearchInput
        showModal={showModalSearch}
        handleClose={handleCloseSearch}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        language={language}
      />
      <PlusButton change={true} />

      <Modal
        show={showModal}
        onHide={handleClose}
        className="itemModal p-0"
        centered
        // size="md"
      >
        <Modal.Body className="p-0">
          <div className="details_item">
            <div className="position-relative">
              <img
                src={showModal && showModal.image}
                alt=""
                className=""
                width="100%"
                height="100%"
              />
              {whatsappNumber && adminDetails?.share_item_whatsapp == 1 && (
                <button
                  onClick={shareOnWhatsApp}
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    right: "0px",
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
                  }}
                >
                  <FaWhatsapp size={20} />
                </button>
              )}
            </div>

            <span>
              <MdCancel
                style={{ color: "#FFF" }}
                className="cancel_button"
                onClick={handleClose}
              />
            </span>

            <div className="details">
              <h3
                className="text-capitalize font-weight-bold text-center font"
                style={{
                  fontFamily: adminDetails?.font_category,
                  fontSize: `${adminDetails.font_size_category}em` ?? "",
                  fontWeight: adminDetails?.font_bold_category
                    ? "bold"
                    : "none",
                }}
              >
                {showModal && showModal.name}
              </h3>
              <div className="line"></div>
              {showModal && showModal.description && (
                <p className="des font">{showModal && showModal.description}</p>
              )}

              {/* {showModal && showModal.price !== 0 && (
                <>
                  {" "}
                  <p className="price font-weight-bold font">
                    {showModal && showModal.price} S.P
                  </p>
                  <AddToCart data={showModal} />
                  <div className="line"></div>
                </>
              )} */}
              {showModal?.adds && showModal?.adds?.length > 0 && (
                <div
                  style={{
                    width: isMobileTooSmallDevice
                      ? "110%"
                      : isMobileSmallDevice
                      ? "108%"
                      : isMobileMediumDevice
                      ? "96%"
                      : "90.5%",
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
                    {showModal?.adds?.map((e, index) => (
                      <SwiperSlide key={index}>
                        <AddToCart data={e} itemImage={showModal.image} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
            <h5 className="text-center font">
              {language === "en" ? "Related Products" : "منتجات ذات صلة"}
            </h5>
            {
              <div className="similar_products ">
                {itemsSimilar && itemsSimilar.length >= 1
                  ? itemsSimilar.slice(0, 2).map((item) => {
                      return (
                        <div
                          key={item.id}
                          style={{
                            background: `#${
                              adminDetails &&
                              adminDetails.color &&
                              adminDetails.color.substring(10, 16)
                            }`,
                            cursor: "pointer",
                          }}
                          className="similar_product"
                          onClick={() => handleShow(item)}
                        >
                          <LazyLoadImage
                            src={item.image}
                            alt=""
                            effect="blur"
                            className=""
                          />

                          <p className="text-center text-truncate itemColor font">
                            {localStorage.getItem("language") == "en"
                              ? item.name_en
                              : item.name_ar}
                            {/* {item.name} */}
                          </p>
                        </div>
                      );
                    })
                  : null}
              </div>
            }
          </div>
        </Modal.Body>
      </Modal>

      {show && (
        <div
          className="sidenav"
          style={{
            background: `#${
              adminDetails &&
              adminDetails.color &&
              adminDetails.color.substring(10, 16)
            }`,
            left: language === "en" ? "3px" : "",
            right: language === "en" ? "" : "3px",
          }}
        >
          {selectedItem && selectedItem.content === 1 ? (
            subCat.map((sub) => {
              return (
                <div
                  className="item_one"
                  key={sub.id}
                  onClick={() => handleClickSubCat(sub.id)}
                >
                  <LazyLoadImage
                    src={sub.image}
                    alt=""
                    effect="blur"
                    className="m-auto"
                  />
                  <p className="text-truncate font subCatColor">
                    {localStorage.getItem("language") == "en"
                      ? sub.name_en
                      : sub.name_ar}

                    {/* {sub.name} */}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="not_found_sub">
              {" "}
              {localStorage.getItem("language") === "en"
                ? "Not Found Sub-Categories"
                : "لايوجد عناصر"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
