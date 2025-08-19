import { Modal } from 'react-bootstrap'
import { FaWhatsapp } from 'react-icons/fa';
import {  useMediaQuery as MQ } from "@mui/material";
import { Navigation } from 'swiper/modules';
import { Swiper,SwiperSlide } from 'swiper/react';
import AddToCart from '../../../utils/user/AddToCart';
import cancel from "../../../assets/User/Vectorrr.png";

const ItemModal = ({showModal,handleClose,item,adminDetails}) => {
    const whatsappNumber = adminDetails?.whatsapp_phone;
    const isMobileTooSmallDevice = MQ("only screen and (max-width : 360px)");
    const isMobileSmallDevice = MQ("only screen and (max-width : 390px)");
    const isMobileMediumDevice = MQ("(min-width: 400px) and (max-width: 500px)"); 
    const backgroundStyle = {
        background: `#${adminDetails?.color?.substring(10, 16)}`,
    }; 
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
        <Modal
            show={showModal}
            size="md"
            centered
            className="itemModal_temp4"
            onHide={handleClose}
        >
            <Modal.Body 
                style={{
                    ...backgroundStyle,
                }}
            >
                <div className="details_item ">
                    <div className="position-relative">
                        {item?.is_panorama ? (
                            <ReactPannellum
                                id="1"
                                sceneId="firstScene"
                                imageSource={item.image}
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
                                src={item && item.image}
                                alt=""
                                className=""
                                style={{ aspectRatio: 1 }}
                            />
                        )}   
                        {whatsappNumber && adminDetails?.share_item_whatsapp==1 && (
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
                    <img
                        src={cancel}
                        alt=""
                        className="cancel_button"
                        onClick={handleClose}
                        style={{
                            background: `#${
                                adminDetails &&
                                adminDetails.color &&
                                adminDetails.color.substring(10, 16)
                            }`,
                        }}
                    />
                    <div className="details w-100 px-3 text-wrap">
                        <h3 className="text-capitalize text-center w-100 text-break font"
                            style={{
                                fontFamily: adminDetails?.font_category,
                                fontSize:`${adminDetails.font_size_category}em`??'',
                                fontWeight:adminDetails?.font_bold_category?'bold':'none',
                            }}
                        >
                            {item && item.name}
                        </h3>

                        <p className="text-center desc font">
                            {item && item.description}
                        </p>

                        { item  && item?.toppings?.length==0 &&
                            <p className="text-dark text-center font-weight-bold text-break w-100 m-0 font"
                                style={{
                                visibility: item && item.price ? "visible" : "hidden", // Keep space if no price
                                }}>
                                {item && item.price ? `${item.price}  ${adminDetails.price_type=='syrian'?'S.P':'$'}` : '\u00A0'}
                            </p>
                        }
                        { item && item.toppings.length==1 && item.price && 
                            <div className="w-100 d-flex justify-content-center ">
                        
                                <AddToCart data={item}  />
                            </div>                   
                        }
                    
                        {item?.toppings && item?.toppings?.length > 1 && (
                            <div
                                style={{
                                    width:isMobileTooSmallDevice?'105%':isMobileSmallDevice?'100%'
                                    :isMobileMediumDevice?'86%':'73.5%'
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
                                    {item?.toppings?.map((e, index) => (
                                        <SwiperSlide
                                            key={index}
                                        >
                                            <AddToCart data={e} itemImage={item.image} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                            </div>
                        )}

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ItemModal
