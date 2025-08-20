import { useContext, useEffect, useRef, useState } from "react";
 import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminProvider";
import axios from "axios";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import Pagination from "../template1/Pagination";
import { Button, Dropdown, Form, Modal, ModalBody } from "react-bootstrap";
// import cancel from "../../assets/Vectorrr.png";
 import { IoMdArrowRoundBack } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
// Import Swiper styles
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
// import required modules
import { EffectCoverflow } from "swiper/modules";
import { LanguageContext } from "../../../context/LanguageProvider";
import WhatssappIcon from "../../../utils/user/WhatssappIcon";
import SearchInput from "../../../utils/user/SearchInput";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetSubCat } from "../../../hooks/user/useGetSubCat";
import { useGetItems } from "../../../hooks/user/useGetItems";
import PlusButton from "../../../utils/user/PlusButton";
import PanoramaImg from "../template1/PanoramaImg";
import ReactPannellum from "react-pannellum";
 import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useMediaQuery } from "@uidotdev/usehooks";
import AddToCart from "../../../utils/user/AddToCart";
import DetailedItemModal from "../template11/Items/ItemModal";
const Temp7Items = () => {
  let navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { adminDetails } = useContext(AdminContext);
  const pageCountItems = useRef();
  const [showModalSearch, setShowModalSearch] = useState(false);
  const handleCloseSearch = () => setShowModalSearch(false);
  const handleShowSearch = () => setShowModalSearch(true);
  // const [searchWord, setSearchWord] = useState("");
  const [showModal, setShowModal] = useState(null);
  const handleClose = () => setShowModal(null);
  const handleShow = (item) => {
    setShowModal(item);
  };
  const isSmallDevice = useMediaQuery("only screen and (max-width : 760px)");
  const isMobileTooSmallDevice = useMediaQuery("only screen and (max-width : 360px)");
  const isMobileSmallDevice = useMediaQuery("only screen and (max-width : 390px)");
  const isMobileMediumDevice = useMediaQuery("(min-width: 400px) and (max-width: 500px)");
  const { pending, isError, error, items, searchWord, setSearchWord, onPress } =
    useGetItems();
  const config = {
    autoRotate: -10,
    autoLoad: true,
    showZoomCtrl: false,
  };
  useEffect(()=>{
    console.log('showModal : ',showModal)
    console.log('items : ',items)
  },[showModal,items])

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
        ...(adminDetails?.background_image_item && adminDetails?.image_or_color
          ? {
              backgroundImage: `url(${adminDetails?.background_image_item})`,
              backgroundSize: "cover", 
              backgroundPosition: "bottom",
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
      <NavBarUser searchWord={searchWord} setSearchWord={setSearchWord} />
      
      {isError && (
        <h3 className="w-100 text-center mt-5 font">
          {" "}
          {language === "en" ? "Not Found Items" : "لا يوجد عناصر"}
        </h3>
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
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </p>
      )}
      <div className="bottom_section_temp5">
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
    ? items.map((item) => {
        return (
          <SwiperSlide style={{ backgroundColor: "transparent" }} key={item.id}>
            {item?.is_panorama ? (
              <PanoramaImg showModal={item} style={{ borderRadius: "30px" }} />
            ) : (
              <LazyLoadImage
                onClick={() => handleShow(item)}
                src={item?.image}
                alt="item"
                width={"100%"}
                height={"100%"}
                effect="blur"
              />
            )}

            <h5
              style={{
                fontFamily: adminDetails?.font_item,
                fontSize: `${adminDetails.font_size_item}em` ?? "",
                fontWeight: adminDetails?.font_bold_item ? "bold" : "none",
              }}
              className="mt-3 text-center w-100 text-break text-capitalize itemColor font"
            >
              {item.name}
            </h5>

            {item.description && (
              <p
                className="text-center w-100 text-capitalize text-break my-2 itemColor font"
                dangerouslySetInnerHTML={{
                  __html: item.description.replace(/\.{3}/g, "<br />"),
                }}
              ></p>
            )}

            {item?.price && (
              <h5 className="text-dark text-center font-weight-bold text-break w-100 m-0 font">
                {`${item.price} ${
                  adminDetails.price_type == "syrian" ? "S.P" : "$"
                }`}
              </h5>
            )}
          </SwiperSlide>
        );
      })
    : null}
</Swiper>
          {
            showModal && 
            <DetailedItemModal
              show={showModal}
              adminDetails={adminDetails}
              item={showModal}
              onHide={()=>setShowModal(false)}
            />
          }


        <PlusButton />

        {pageCountItems.current > 1 ? (
          <Pagination pageCount={pageCountItems.current} onPress={onPress} />
        ) : null}
      </div>
    </div>
  );
};

export default Temp7Items;
