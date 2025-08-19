import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminProvider";
import Pagination from "../template1/Pagination";
import { Button, Dropdown, Form, Modal, ModalBody } from "react-bootstrap";
import cancel from "../../../assets/User/Vectorrr.png";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow } from "swiper/modules";
import { LanguageContext } from "../../../context/LanguageProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetSubCat } from "../../../hooks/user/useGetSubCat";
import { useGetItems } from "../../../hooks/user/useGetItems";
import PlusButton from "../../../utils/user/PlusButton";
import PanoramaImg from "../template1/PanoramaImg";
import { baseURLPublicName } from "../../../Api/baseURL";
import AddToCart from "../../../utils/user/AddToCart";
import { useMediaQuery } from "@uidotdev/usehooks";
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const Temp9Items = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedAdd, setSelectedAdd] = useState(null);
    const isSmallDevice = useMediaQuery("only screen and (max-width : 760px)");
    const isMobileTooSmallDevice = useMediaQuery("only screen and (max-width : 360px)");
    const isMobileSmallDevice = useMediaQuery("only screen and (max-width : 390px)");
    const isMobileMediumDevice = useMediaQuery("(min-width: 400px) and (max-width: 500px)");
    
    // Function to handle radio selection
    const handleImageChange = (add) => {
      setSelectedImage(add?.image);
      setSelectedAdd(add);
    };
    
    // Get the main image URL
    let navigate = useNavigate();
    const { language } = useContext(LanguageContext);
    const { adminDetails } = useContext(AdminContext);
    const [showModalSearch, setShowModalSearch] = useState(false);
    const handleCloseSearch = () => setShowModalSearch(false);
    const handleShowSearch = () => setShowModalSearch(true);
    
    const pageCountItems = useRef();
    const [showModal, setShowModal] = useState(null);
    const handleClose = () => setShowModal(null);
    
    const handleShow = (item) => {
      const defaultImage = item?.adds?.[0]?.image || item.image;
      const defaultAdd = item?.adds?.[0] || null;
      setSelectedImage(defaultImage);
      setSelectedAdd(defaultAdd);
      setShowModal(item);
      console.log('item : ',item)
      console.log('adminDetails : ',adminDetails)
    };

    const { pending, isError, error, items, searchWord, setSearchWord, onPress } =
      useGetItems();
  
    const config = {
      autoRotate: -10,
      autoLoad: true,
      showZoomCtrl: false,
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
      minHeight: "100dvh",
      ...(adminDetails?.background_image_item && adminDetails?.image_or_color
        ? {
            backgroundImage: `url(${baseURLPublicName}/storage${adminDetails?.background_image_item})`,
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
}}>
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
          className="mySwiper">
          {items && items.length > 0
            ? items.map((item) => {
                return (
                  <>
                    <SwiperSlide
                      style={{backgroundColor:'transparent'}}
                        key={item.id}>
                    { item?.is_panorama?(
                      <PanoramaImg showModal={item} style={{ borderRadius: "30px" }}/>)
                      :(
                      <LazyLoadImage
                        src={item.image}
                        onClick={() => handleShow(item)}
                        alt="item"
                        width={"100%"}
                        height={"100%"}
                        effect="blur"
                      />
                      )}
                      <h5 
                      style={{
                          fontFamily: adminDetails?.font_item,
                          fontSize:`${adminDetails.font_size_item}em`??'',
                          fontWeight:adminDetails?.font_bold_item?'bold':'none',
                      }}
                      className="mt-3 text-center w-100 text-break text-capitalize itemColor font">
                        {item.name}
                      </h5>
                      {item.description && (
                          <p 
                            className="text-center w-100 text-capitalize text-break my-2 itemColor font"
                            dangerouslySetInnerHTML={{
                              __html: item.description.replace(/\.{3}/g, "<br />")
                            }}
                          ></p>
                        )}
                          {item &&item?.price && 
                          <h5 className="text-dark text-center font-weight-bold text-break w-100 m-0 font">
                          {`${(item && item.price) } ${adminDetails.price_type=='syrian'?'S.P':'$'}`}
                        </h5>}
                    </SwiperSlide>
                  </>
                );
              })
            : null}
        </Swiper>
        <Modal
          show={showModal}
          size="md"
          centered
          className="itemModal_temp4"
          onHide={handleClose}
          >
          <Modal.Body>
              <div className="details_item">
              <img
                  src={cancel}
                  alt=""
                  className="cancel_button"
                  onClick={handleClose}
                  style={{
                  background: `#${
                      adminDetails && adminDetails.color && adminDetails.color.substring(10, 16)
                  }`,
                  }}
              />
              <div className="position-relative">
              <LazyLoadImage
                  src={selectedImage || showModal?.image} // Show selected image or fallback to the main image
                  alt="item"
                  width={"100%"}
                  height={"100%"}
                  effect="blur"
                  style={{ borderRadius: "15px" }}
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

              <div className="details w-100 px-3 text-wrap">
              {(!adminDetails?.is_order || adminDetails?.is_order !== 1) && (
    <>
      <h3 className="text-capitalize text-center w-100 text-break font">
        {/* Show selected add-on name or main item name */}
        {selectedAdd?.name || showModal?.name}
      </h3>
      {(selectedAdd?.price || showModal?.price) && (
        <p className="text-dark text-center font-weight-bold text-break w-100 m-0 font">
          {/* Show selected add-on price or main item price */}
          {`${selectedAdd?.price || showModal?.price} ${
            adminDetails.price_type == "syrian" ? "S.P" : "$"
          }`}
        </p>
      )}
      {showModal?.description && (
        <p
          className="text-center desc font"
          dangerouslySetInnerHTML={{
            __html: showModal.description.replace(/\.{3}/g, "<br />"),
          }}
        ></p>
      )}
    </>
  )}

                {/* Radio Buttons for Additional Items */}
{showModal?.adds?.length > 0 && (
  <div className="mt-3" dir="rtl">
    <Form className="d-flex flex-column space-between">
      {showModal.adds.map((add, index) => (
        <Form.Check
          key={index}
          type="radio"
          id={`addon-${index}`}
          label={
            <div className="d-flex justify-content-between w-100">
              <span className="mx-2">{add.name}</span>
              <span>
                {add.price} {adminDetails.price_type == "syrian" ? "S.P" : "$"}
              </span>
            </div>
          }
          name="addon"
          checked={selectedAdd?.id === add?.id}
          onChange={() => handleImageChange(add)}
          // className="w-100"
          style={{ textAlign: 'right' }}
        />
      ))}
    </Form>
  </div>
)}

                  {/* Add to Cart Button */}
               {/* Add to Cart Button - Show only if is_order is enabled (1) */}
{(adminDetails?.is_order === 1 && (showModal?.adds?.length === 1 || selectedAdd)) && (
  <div className="mt-2 p-4 d-flex justify-content-center w-100">
    <AddToCart 
      data={selectedAdd || showModal} 
      itemImage={selectedImage || showModal?.image} 
    />
  </div>
)}

              </div>
            </div>
          </Modal.Body>
        </Modal>
        <PlusButton />
        {pageCountItems.current > 1 ? (
          <Pagination pageCount={pageCountItems.current} onPress={onPress} />
        ) : null}
      </div>
    </div>
  )
}

export default Temp9Items;