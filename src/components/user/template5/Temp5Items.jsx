import { useNavigate } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { Button, IconButton } from "@mui/material";
import { IoMdArrowRoundBack } from "react-icons/io";
// import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetItems } from "../../../hooks/user/useGetItems";
import AddToCart from "../../../utils/user/AddToCart";
import { ToastContainer } from "react-toastify";
import ReactPannellum from "react-pannellum";
import { useContext, useState } from "react";
import { LanguageContext } from "../../../context/LanguageProvider";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { addOrder } from "../../../redux/slice/user section/ordersSlice";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import {  useMediaQuery } from "@mui/material";
import notify from "../../../utils/useNotification";
import { AdminContext } from "../../../context/AdminProvider";
import { FaWhatsapp } from "react-icons/fa";
const Temp5Items = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { adminDetails } = useContext(AdminContext);
  const [heSaidNo, setHeSaidNo] = useState(localStorage.getItem('heSaidNo')); 

  let navigate = useNavigate();
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
 //for panorama
 const config = {
  autoRotate: -10,
  autoLoad: true,
  showZoomCtrl: false,
  showControls: false,
};
  const { language, toggleLanguage } = useContext(LanguageContext);
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    let message_ar = 'تمت إضافة العنصر إلى السلة بنجاح'
    let message_en = 'Item has been successfully added to cart.'
    console.log('data , : ',data)
        if(data.price==null){
          notify('price is null', 'warn')
          return ;
        }
         // Remove commas from price and parse it into a number
  const cleanPrice = Number(data.price.toString().replace(/,/g, ''));
  await dispatch(
    addOrder({
      id: data.id,
      name: data.name,
      count: 1,
      image: data.image,
      price: cleanPrice,
    })
  );
  notify(language === 'en' ? message_en : message_ar, 'success')
};

  return (
    <div style={{ minHeight: "100vh",
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
     }} className="bgColor">
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
      {isError && (
        <div className="alert alert-danger" role="alert">
          {error.data.message}
        </div>
      )}
      {!isError && (
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
          minHeight: "calc(100vh - 124px)",
        }}

      >
        <div className="bottom_section_temp5"
      
      >
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
          >
            {items && items.length > 0
              ? items
              .map((item) => {
               
                const imageUrl = `${item.image}`;
                const whatsappNumber = adminDetails?.whatsapp_phone;

                const shareOnWhatsApp = () => {
                  if (whatsappNumber) {
                    const message = `Check out this item: ${item.name} - ${imageUrl}`;
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      message
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }
                };        
                  return (
                    <>
                      <SwiperSlide
                      key={item.id}>
                        <div className="position-relative">
                        { item?.is_panorama?
                      (
                        <ReactPannellum
                        // id="1"
                        id={`pannellum-${item.id}`} // Unique ID
                        // sceneId="firstScene"
                        sceneId={`scene-${item.id}`} // Unique Scene ID
                        imageSource={item.image}
                        config={config}
                        style={{
                          borderRadius: "33px 25px",
                          width: "100%",
                          // height: "400px",
                          aspectRatio: 1,
                          background: "#000000",
                        }}
                      />
                        )
                          :(
                          <LazyLoadImage
                          // src={item.image}
                          src={item.image}
                          alt="item"
                          width={"100%"}
                          height={"100%"}
                          effect="blur"
                          />)}
                          
                           {/* WhatsApp Button */}
            {whatsappNumber && adminDetails?.share_item_whatsapp==1 && (
              <button
                onClick={shareOnWhatsApp}
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
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
                   
                            { item  && item?.adds?.length==1 &&
                            <>
                        <h5 className="mt-3 text-center w-100 text-break text-capitalize itemColor font"
                          style={{
                            fontFamily: adminDetails?.font_item,
                            fontSize:`${adminDetails.font_size_item}em`??'',
                            fontWeight:adminDetails?.font_bold_item?'bold':'none',
                          }}
                        >
                          {/* {item.name} */}
                      {localStorage.getItem('language')=="en"?item.name_en:item.name_ar}
                        </h5>
                        {item.description && (
                          <p className="text-center w-100 text-capitalize text-break my-2 itemColor font">
                            {localStorage.getItem('language')=="en"?description.name_en:description.name_ar}
                            {/* {item.description} */}
                          </p>
                        )}
                          <p className="text-dark text-center font-weight-bold text-break w-100 m-0 font"
                        style={{
                          visibility: item && item.price ? "visible" : "hidden", // Keep space if no price
                        }}>
                        {item && item.price ? `${item.price} ${adminDetails.price_type=='syrian'?'S.P':'$'}` : '\u00A0'}
                      </p>
                        { item && item.adds.length==1 && item.price && adminDetails.is_order==1 && !heSaidNo &&

                          <div className="mt-2 p-4 d-flex justify-content-center">
                            <Button
                          variant="contained"
                          size="large"
                          className={"bgColorLikeColor font p-2"}
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleSubmit(item)}
                          >
                          {localStorage.getItem('language') === "ar" ? "إضافة إلى السلة" : "Add to cart"}
                        </Button>
                        </div>}
                     </>}
                  {/* { item && item.adds.length==0 && 
                  <div 
                  style={{
                    display:'flex',
                    justifyContent:'center',
                    margin:'4px',
                  }}>
                   // comment  <AddToCart data={item}  /> 

                  <Button
                  variant="contained"
                  size="large"
                  className={"bgColorLikeColor font"}
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleSubmit(item)}
                  >
                  {language === "ar" ? "إضافة إلى السلة" : "Add to cart"}
                </Button>
                    </div>                   
                 } */}
                 {item?.adds && item?.adds?.length > 1 && (
                    <div
                     style={{
                      width:isSmallDevice?'99.82%':'100%'
                    }}
                    >
                    <Swiper
                      navigation={true}
                      modules={[Navigation]}
                      spaceBetween={4}
                      style={{
                        "--swiper-navigation-color": "#000",
                        "--swiper-navigation-size": "20px",
                        textAlign:'center',
                      }}
                    >
                      { item?.adds?.map((e, index) => (
                        <SwiperSlide
                          key={index}
                        >
                          <AddToCart data={e} itemImage={item.image} />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                   </div>
                    )}
                        {/* <div className="d-flex justify-content-center py-5"> */}
                          {/* <AddToCart data={item} /> */}
                        {/* </div> */}
                      </SwiperSlide>
                    </>
                  );
                })
              : null}
          </Swiper>
          
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

      <ToastContainer/>
    </div>
  );
};

export default Temp5Items;
