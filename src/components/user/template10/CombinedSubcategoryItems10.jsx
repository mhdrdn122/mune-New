import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../template1/Pagination";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import NavBarUser from "../../../utils/user/NavBarUser";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { baseURLPublicName } from "../../../Api/baseURL";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PanoramaImg from "../template1/PanoramaImg";
import { CategoriesContext } from "../../../context/CategoriesProvider";
import DetailedItemModal from "../template11/Items/ItemModal";

const CombinedSubcategoryItems10 = () => {
  const {categories} = useContext(CategoriesContext)
  const { id } = useParams();
  const [selectedCat,setSelectedCat] = useState();
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [subCategories,setSubCategories] =useState();
  const [items,setItems] = useState()
  const { adminDetails } = useContext(AdminContext);
  const [selectedItem,setSelectedItem] = useState()
  useEffect(()=>{
    setSelectedCat(categories?.find((cat)=>cat?.id == parseInt(id)))
  },[categories])
  
  useEffect(()=>{
    if(selectedCat?.content === 0 ){
      setSubCategories(null);
      setItems(null);
    }else if(selectedCat?.content === 1){
      setSubCategories(selectedCat?.sub_category);
      setSelectedSubId(selectedCat?.sub_category[0]?.id)
    }else{
      setItems(selectedCat?.items)
      setSubCategories(null)
    }
    
  },[selectedCat])

  useEffect(()=>{
    setItems((subCategories?.find((sub)=>sub?.id === selectedSubId))?.items)
  },[selectedSubId])
  
  const [showModal, setShowModal] = useState(null);
  const handleShow = (item) => {
    setSelectedItem(item)
    setShowModal(true);
  };
   const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      ...(adminDetails?.background_image_item && adminDetails?.image_or_color
      ? {
        backgroundImage: `url(${baseURLPublicName}/storage${adminDetails?.background_image_item})`,
        backgroundSize: "cover", 
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }:{
        backgroundColor: `#${
          adminDetails?.background_color?.substring(10, 16) || 'ffffff'
        }`,
      }),        
      }}
    >
      <NavBarUser />
      <div
        style={{
          textDecoration: "none",
          color: "#111",
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
      <div className="subcategory-tabs-container" style={{ padding: '0 20px'  }}>
        { subCategories?.length > 0 && 
          <div style={{ position: 'relative' }}>
            <div>
              <Swiper
                slidesPerView={'auto'}
                spaceBetween={-10}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                modules={[Navigation]}
                style={{
                  width:"100%",
                    padding: '10px 0',
                    '--swiper-navigation-color': adminDetails?.color?.substring(10, 16) || '#000',
                    '--swiper-navigation-size': '24px',
                }}
                // className="swiper-slide1"
              >
                {subCategories?.map(sub => (
                  <SwiperSlide 
                    key={sub.id}
                    style={{
                      minWidth: 'fit-content', 
                      flexShrink: 0,            
                    }}
                    className="swiper-slide2"
                  >
                    <div
                      className={`subcategory-tab flex justify-center items-center ${selectedSubId === sub.id ? 'active' : ''}`}
                      onClick={() => setSelectedSubId(sub.id)}
                      style={{
                        fontFamily: adminDetails?.font_category,
                        // fontSize: `${adminDetails?.font_size_category || 1}em`,
                        fontSize: `1em`,

                        fontWeight: adminDetails?.font_bold_category ? 'bold' : 'normal',
                        padding: '8px 30px',     
                        margin:"0 10px",
                        borderRadius: '25px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        backgroundColor: selectedSubId === sub.id 
                          ? `#${adminDetails?.color?.substring(10, 16) || '9a6a6a'}` 
                          : 'rgba(0,0,0,0.05)',
                        color: selectedSubId === sub.id ? '#fff' : '#333',
                        textAlign: 'center !important',   
                         
                      }}
                    >{sub.name}
                        <p></p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }
      </div>
      <div className="items-display">
        <div className="">
          {items &&  items?.length > 0 ? (
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
              {items && items?.length > 0  && items?.map((item) => {
                const imageUrl = item?.image;
                const whatsappNumber = adminDetails?.whatsapp_phone;
                return (
                  <SwiperSlide
                    style={{ backgroundColor: 'transparent' }} 
                    key={item.id}
                  >
                    <div className="position-relative">
                      {item?.is_panorama ? (
                          <PanoramaImg showModal={item} style={{ borderRadius: "30px" }} />
                        ) : (
                          imageUrl ? (
                            <div style={{ position: 'relative' }}>
                              <LazyLoadImage
                                src={item?.image}
                                onClick={() => handleShow(item)}
                                alt="item"
                                width={"100%"}
                                height={"100%"}
                                effect="blur"
                                style={{
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                  animation: "pulse 2s infinite",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "scale(1.02) translateY(-3px)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                                  },
                                  "@keyframes pulse": {
                                    "0%": { boxShadow: "0 0 0 0px rgba(154, 106, 106, 0.4)" },
                                    "100%": { boxShadow: "0 0 0 10px rgba(154, 106, 106, 0)" }
                                  }
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                opacity: 0.6,
                                transition: 'opacity 0.3s ease'
                              }}>
                                Click to view
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "200px",
                                borderRadius: "30px",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#999",
                              }}
                            >
                              {language === "en" ? "No image available" : "لا توجد صورة"}
                            </div>
                          )
                        )}
          
                        {whatsappNumber && adminDetails?.share_item_whatsapp === 1 && (
                          <button
                            onClick={() => {
                              const message = `Check out this item: ${item.name} - ${imageUrl}`;
                              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                              window.open(whatsappUrl, "_blank");
                            }}
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
                    <h5
                      style={{
                        fontFamily: adminDetails?.font_item,
                        fontSize: `${adminDetails.font_size_item}em` ?? '',
                        fontWeight: adminDetails?.font_bold_item ? 'bold' : 'none',
                      }}
                      className="mt-3 text-center w-100 text-break text-capitalize itemColor font"
                    >
                      {item.name}
                    </h5>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            ) : (
              <div className="text-center py-5">
                {language === "en" ? "No items found" : "لا توجد عناصر"}
              </div>
            )
          }
        </div>
      </div>
      <DetailedItemModal
        show={showModal}
        item={selectedItem}
        onHide={()=>setShowModal(false)}
        adminDetails={adminDetails}
      />
    </div>
  );
};
export default CombinedSubcategoryItems10