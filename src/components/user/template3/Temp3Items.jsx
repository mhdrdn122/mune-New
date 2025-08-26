import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminProvider";
import axios from "axios";
import Pagination from "../template1/Pagination";
import { Dropdown, Form, Modal, ModalBody, Spinner } from "react-bootstrap";
import cancel from "../../../assets/User/Vectorrr.png";
 import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Search from "../template6/Search";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetItemsQuery } from "../../../redux/slice/user section/itemsApi";
import PlusButton from "../../../utils/user/PlusButton";
import AddToCart from "../../../utils/user/AddToCart";
import ReactPannellum from "react-pannellum"
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { addOrder } from "../../../redux/slice/user section/ordersSlice";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import {  useMediaQuery } from "@mui/material";
import notify from "../../../utils/useNotification";
const Temp3Items = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");

  const isMobileTooSmallDevice = useMediaQuery("only screen and (max-width : 360px)");
  const isMobileSmallDevice = useMediaQuery("only screen and (max-width : 390px)");
  const isMobileMediumDevice = useMediaQuery("(min-width: 400px) and (max-width: 500px)");

  let navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const pageCountItems = useRef();
  const { username, id, id2 } = useParams();
  const handleClose = () => setShowModal(null);
  const handleShow = (item) => setShowModal(item);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);
  const dispatch = useDispatch()

  const handleSubmit = async (data) => {
    let message_ar = 'تمت إضافة العنصر إلى السلة بنجاح'
    let message_en = 'Item has been successfully added to cart.'
    console.log('data , : ',data)
  if(data.price==null){
    notify('price is null', 'warn')
    return ;
  }

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

  console.log(itemsData);

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
  return (
    <div style={{ minHeight: "100vh", background: "" }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />

      {
        // <div className="banner">
        //   {
        //     <Link
        //     to={adminDetails.cover}
        //   >
        //     <img
        //       src={adminDetails.cover}
        //       alt="ar"
        //     />
        //     </Link>
        //     // <img src={img1} alt="ar" />
        //   }
        // </div>
      }

      <div
        style={{
          textDecoration: "none",
          color: "#111",
          // backgroundColor: "",
          fontSize: "24px",
          padding: "10px 20px",
          borderRadius: "5px",
          display: "inline-block",
          cursor: "pointer",
        }}
        className="color"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack />
      </div>

      {isError && (
        <h3 className="w-100 text-center mt-5">
          {error.data && error.data.message && error.data.message}
        </h3>
      )}

      <div
        className="d-flex flex-column align-items-center justify-content-start"
        style={{ minHeight: "calc(100vh - 126px)" }}
      >
        <div className="template3_items pt-0"
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
                <Fragment key={item.id}>
                  <div
                    className="temp3_itemm pt-0"
                    style={{
                      backgroundColor: `#${
                        adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                      }`,
                    }}
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
                            height: "170px",
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
                                height= "160px"
                                className="temp3_item_image"
                              /> 
                              </> 
                            )
                            } 
                    <p className="itemColor font font-weight-bold text-center text-truncate">
                      {item.name}
                    </p>
                    
                    { 
                    <p className="text-dark text-center font-weight-bold text-break w-100 m-0 font"
                    style={{
                      visibility: item && item.price ? "visible" : "hidden", // Keep space if no price
                    }}>
                    {item && item.price ? `${item.price} S.P` : '\u00A0'}
                  </p>}
                  
                      

                  </div>
                </Fragment>
              );
            })
          ) : (
            <h3 className="w-100 text-center mt-5">
              {" "}
              {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}
            </h3>
          )}
        </div>

        <PlusButton />
        <Modal
          show={showModal}
          onHide={handleClose}
          className="temp3_modal"
          
        >
          <ModalBody>
            <div
              className="details_item"
              style={{
                backgroundColor: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              {showModal?.is_panorama ? (
                    <ReactPannellum
                    
                      id="1"
                      sceneId="firstScene"
                      imageSource={showModal.image}
                      config={config}
                      style={{
                        width: '250px',
                        height: '250px',
                        position: 'absolute',
                        top: '10px',
                      }}
                    />
                  ) : (
                    <img
                      src={showModal && showModal.image}
                      alt=""
                      className="w-100 rounded temp3_image"
                      style={{ aspectRatio: 1 }}
                    />
                  )}
              <img
                src={cancel}
                alt=""
                className="cancel_button"
                onClick={handleClose}
              />
              <div className="details">
                <h3 className="itemColor font text-capitalize text-center w-100 my-1 px-3">
                  {showModal && showModal.name}{" "}
                </h3>
                {showModal && showModal.description && (
                  <p className="itemColor font text-capitalize text-center w-100 my-1">
                    {showModal && showModal.description}
                  </p>
                )}
                  {/* { 
                    <p className="text-dark text-center font-weight-bold text-break w-100 m-0 font"
                    style={{
                      visibility: showModal && showModal.price ? "visible" : "hidden", // Keep space if no price
                    }}>
                    {showModal && showModal.price ? `${showModal.price} S.P` : '\u00A0'}
                  </p>}
                   */}
                 { showModal  && showModal?.adds?.length==0 &&
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
                      width:isMobileTooSmallDevice?'88%':isMobileSmallDevice?'85%'
                      :isMobileMediumDevice?'76%':'70.5%'
                    }}
                    >
                    <Swiper
                      navigation={true}
                      modules={[Navigation]}
                      spaceBetween={4}
                      style={{
                        "--swiper-navigation-color": "#000",
                        "--swiper-navigation-size": "20px",
                      }}
                    >
                      {showModal?.adds?.map((e, index) => (
                        <SwiperSlide
                          key={index}
                        >
                          <AddToCart data={e} itemImage={showModal.image} />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                   </div>
                    )}
{/* 
                <div className="w-75">
                <AddToCart data={showModal} />
                </div> */}
              </div>
            </div>
          </ModalBody>
        </Modal>
        {pageCountItems.current > 1 ? (
          <div className="mb-2" style={{ flex: "1", display: 'flex', alignItems:'end' }}>
            <Pagination pageCount={pageCountItems.current} onPress={onPress} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Temp3Items;
