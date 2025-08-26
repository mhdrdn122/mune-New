import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import rec1 from "../../../assets/User/Rectangle 74.png";
import rec2 from "../../../assets/User/Rectangle 6.png";
import rec3 from "../../../assets/User/Rectangle 11.png";
import search from "../../../assets/User/icon _search outline_.png";
import cancel from "../../../assets/User/Vectorrr.png";
import searchIcon from "../../../assets/User/_search outline.png";
import { Dropdown, Form, Modal, ModalBody, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import axios from "axios";
import Slider from "react-slick";
import Pagination from "../template1/Pagination";
import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
  import Cover from "../template1/Cover";
import { MdCancel } from "react-icons/md";
import NavBarUser from "../../../utils/user/NavBarUser";
import SearchInput from "../../../utils/user/SearchInput";
import { useGetItemsQuery } from "../../../redux/slice/user section/itemsApi";
import { IoMdArrowRoundBack } from "react-icons/io";
import PlusButton from "../../../utils/user/PlusButton";
import AddToCart from "../../../utils/user/AddToCart";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactPannellum from "react-pannellum"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Button, useMediaQuery } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import notify from "../../../utils/useNotification";
import { useDispatch } from "react-redux";
import { addOrder } from "../../../redux/slice/user section/ordersSlice";

// Import Swiper styles

const Items = () => {

  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");

  const isMobileTooSmallDevice = useMediaQuery("only screen and (max-width : 360px)");
  const isMobileSmallDevice = useMediaQuery("only screen and (max-width : 390px)");
  const isMobileMediumDevice = useMediaQuery("(min-width: 400px) and (max-width: 500px)");

  const navigate = useNavigate();
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { categories, setCategories, pageCount } =
    useContext(CategoriesContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const pageCountItems = useRef();
  const { id, id2 } = useParams();
  console.log(id);
  console.log(id2);
  const handleClose = () => setShowModal(null);
  const handleShow = (item) => {
    console.log('item : ',item);
    setShowModal(item)
  };

  const handleCloseSearch = () => setShowModalSearch(false);
  const handleShowSearch = () => setShowModalSearch(true);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    console.log('data , : ',data)
  if(data.price==null){
    notify('price is null', 'warn')
    return ;
  }
  let message_ar = 'تمت إضافة العنصر إلى السلة بنجاح'
  let message_en = 'Item has been successfully added to cart.'

  await dispatch(
    addOrder({
      id: data.id,
      name: data.name,
      count: 1,
      image: data.image,
      price: data.price,
    })
  );
  notify(language === 'en' ? message_en : message_ar, 'success')
};

  const onChangeSearch = (e) => {
    setSearchWord(e.target.value);
  };
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const getItemById = (id) => {
    const parsedId = parseInt(id, 10); // Parse id to a number
    return categories?.find((item) => item.id === parsedId);
  };
  const selectedItem = getItemById(id);

  const {
    data: itemsData,
    isError,
    isSuccess,
    error,
    isLoading,
    isFetching: pending,
  } = useGetItemsQuery(
    {
      catId: parseInt(id2) !== 0 ? id2 : id,
      word: debouncedSearch,
      page,
      language,
    },
    { skip: !get }
  );

  console.log('itemsData : ',itemsData);

  useEffect(() => {
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      setGet(true);
    }
  }, [adminDetails]);

  useEffect(() => {
    if (!pending && isSuccess) {
      setItems(itemsData.data);
      pageCountItems.current = itemsData?.meta?.total_pages;
    }
  }, [pending, isSuccess, itemsData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);

  const onPress = (page) => {
    setPage(page);
  };

  //for panorama
  const config = {
    autoRotate: -10,
    autoLoad: true,
    showZoomCtrl: false,
    showControls: false,
  };

  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 4,
  //   autoplay: false,
  //   autoplaySpeed: 2000,
  //   waitForAnimate: true,
  //   responsive: [
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         rows: 2,
  //         // slidesPerRow: 2,
  //         slidesToShow: 2,
  //         slidesToScroll: 2,
  //       },
  //     },
  //   ],
  // };
  return (
    <div style={{ minHeight: "100vh", display: "" }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      <div
      // className="banner"
      // style={{ width: "calc(100%)", marginLeft: "auto" }}
      >
        <div
          className="d-flex "
          style={{
            flexDirection: language === "en" ? "row" : "row-reverse",
          }}
        >
          <div
            className="left_section mt-5 py-5 "
            style={{
              background: `#${
                adminDetails &&
                adminDetails.color &&
                adminDetails.color.substring(10, 16)
              }`,
            }}
          >
            {categories &&
              categories.slice(0, 5).map((cat) => {
                return (
                  <Link
                    to={`${
                      cat.is_sub === 1
                        ? `/${username}/template/2/category/${cat.id}`
                        : `/${username}/template/2/category/${cat.id}/sub-category/0`
                    }`}
                    key={cat.id}
                  >
                    <p
                      className="text-capitalize m-4 text-truncate categoryColor font "
                      style={{ direction: language === "en" ? "ltr" : "rtl" }}
                    >
                      {cat.name}
                    </p>
                  </Link>
                );
              })}
            <Link to={`/${username}/template/2/home`} className="w-100">
              <p className="text-capitalize categoryColor font">
                {language === "en" ? "More" : "المزيد"}
              </p>
            </Link>
          </div>

          <div
            className="right"
            style={{ width: "calc(100% - 50px)", padding: "0px" ,
            }}
          >
            <div
              style={{
                textDecoration: "none",
                color: "#111",
                // backgroundColor: "",
                fontSize: "30px",
                padding: "8px 10px",
                borderRadius: "5px",
                display: "inline-block",
                cursor: "pointer",
              }}
              className="color"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack />
            </div>
            <div
              className=" "
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 131px)",
              }}
            >
              <div
                className="offers_temp2 px-2"
                style={{
                  flexDirection: language === "en" ? "row" : "row-reverse",
                }}
              >
                {pending ? (
                  <p className="text-center mt-5 color">
                    <Spinner
                      className="m-auto"
                      animation="border"
                      // variant="primary"
                    />
                  </p>
                ) : items.length > 0 ? (
                  items
                  .map((item) => {
                      return (
                        <>
                          <div
                            className="offer offer_temp2  px-2 mb-3"
                            key={item.id}
                            onClick={() => handleShow(item)}
                          >
                              { item?.is_panorama?(
                            <ReactPannellum
                            id={`${item.id}`}
                            sceneId="firstScene"
                            imageSource={item.image}
                            config={config}
                            style={{
                            borderRadius: "10px 12px",
                            width: "100%",
                            height: "180px",
                            // aspectRatio: 1,
                            background: "#000000",
                            }}
                            />
                            ):(
                              <>
                              <LazyLoadImage
                                src={item.image}
                                alt={""}
                                effect="blur"
                                width= "100%"
                                height= "170px"
                                className="temp2_item_image"
                              /> 
                              </> 
                            )}
                            <p
                              className="itemColor font text-capitalize text-center text-truncate mt-3 w-100"
                              style={{
                                direction: language === "en" ? "ltr" : "rtl",
                              }}
                            >
                              {item.name}
                            </p>
                          </div>
                        </>
                      );
                    })
                ) : (
                  <h3 className="text-center mt-5 font">
                    {" "}
                    {language === "en"
                      ? "Not Found Items"
                      : "لا يوجد عناصر"}{" "}
                  </h3>
                )}
              </div>

              {pageCountItems.current > 1 ? (
                <div
                  className="m-auto"
                  style={{ flex: 1, display:'flex',alignItems: "end" }}
                >
                  <Pagination
                    pageCount={pageCountItems.current}
                    onPress={onPress}
                  />
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

            <PlusButton />

            <Modal
              show={showModal}
              onHide={handleClose}
              className="itemModal"
              centered
            >
              <ModalBody className="p-0">
                <div className="details_item">
                {showModal?.is_panorama ? (
                    <ReactPannellum
                      id="1"
                      sceneId="firstScene"
                      imageSource={showModal.image}
                      config={config}
                      style={{
                        borderRadius:'33px 25px',
                        width: "100%",
                        // height: "400px",
                        aspectRatio: 1,
                        background: "#000000",
                      }}
                    />
                  ) : (
                    <img
                      src={showModal && showModal.image}
                      alt=""
                      className=""
                      style={{ aspectRatio: 1 }}
                    />
                  )}
                  <img
                    src={cancel}
                    alt=""
                    className="cancel_button"
                    onClick={handleClose}
                  />
                  <span>
                    <MdCancel
                      style={{ color: "#FFF" }}
                      className="cancel_button"
                      onClick={handleClose}
                    />
                  </span>
                  <div className="details">
                    <div className="mt-3 w-100">
                      <h3 className="font text-capitalize text-center text-break">
                        {showModal && showModal.name}
                      </h3>
                      <p
                        className="font text-center mb-2"
                        style={{ fontSize: "20px", color: "#000" }}
                      >
                        {showModal && showModal.description}
                      </p>

                      { showModal && showModal.adds.length==0 && 
                    <p className="text-dark text-center font-weight-bold text-break w-100 m-0 font"
                    style={{
                      visibility: showModal && showModal.price ? "visible" : "hidden", // Keep space if no price
                    }}>
                    {showModal && showModal.price ? `${showModal.price} S.P` : '\u00A0'}
                  </p>
                  }
                  { showModal && showModal.adds.length==0 && 
                  <div 
                  style={{
                    display:'flex',
                    justifyContent:'center',
                    margin:'4px',
                  }}>

                  {/* //  <AddToCart data={showModal}  /> */}
                  <Button
                  variant="contained"
                  size="large"
                  className={"bgColorLikeColor font"}
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleSubmit(showModal)}
                  >
                  {language === "ar" ? "إضافة إلى السلة" : "Add to cart"}
                </Button>
                    </div>                   
                 }
               {showModal?.adds && showModal?.adds?.length > 0 && (
                    <div 
                    style={{
                      width:isMobileTooSmallDevice?'114%':isMobileSmallDevice?'109%'
                      :isMobileMediumDevice?'100%':'70.5%'
                    }}
                    >
                    <Swiper
                      navigation={true}
                      modules={[Navigation]}
                      style={{
                        "--swiper-navigation-color": "#000",
                        "--swiper-navigation-size": "20px",
                      }}
                    >
                      {showModal?.adds?.map((e, index) => (
                        <SwiperSlide
                          key={index}
                        >
                          <AddToCart data={e}  itemImage={showModal.image} />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                   </div>
                    )}
                    </div>
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
