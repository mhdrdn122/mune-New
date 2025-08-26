import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminProvider";
import Pagination from "../template1/Pagination";
import { Modal } from "react-bootstrap";
import { LanguageContext } from "../../../context/LanguageProvider";
import { FaWhatsapp } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SearchInput from "../../../utils/user/SearchInput";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useGetItemsQuery } from "../../../redux/slice/user section/itemsApi";
import AddToCart from "../../../utils/user/AddToCart";
import ReactPannellum from "react-pannellum"
import { addOrder } from "../../../redux/slice/user section/ordersSlice";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import {  useMediaQuery as MQ } from "@mui/material";
import notify from "../../../utils/useNotification";
import Footer from "./Footer";
import ItemModal from "./ItemModal";
import { ToastContainer } from "react-toastify";
import DetailedItemModal from "../template11/Items/ItemModal";

const Temp4Items = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [pageCountItems, setPageCountItems] = useState("");
  const { id, id2 } = useParams();
  const [selectedItem,setSelectedItem] = useState()
  const handleShow = (item) => {
    console.log('item',item)
    setShowModal(true);
    setSelectedItem(item)
    
  };
  const [showModalSearch, setShowModalSearch] = useState(false);
  const { language} = useContext(LanguageContext);

  const handleCloseSearch = () => setShowModalSearch(false);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const { username } = useParams();
  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  const {
    data: itemsData,
    isError,
    isSuccess,
    error,
    isLoading,
    isFetching: pending
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
      setPageCountItems(itemsData?.meta?.total_pages);
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
    <div style={{ minHeight: "100vh" ,
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
      <div
        className="bottom_section_temp4"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        {isError && (
          <h3 className="w-100 text-center mt-5">
            {error.data && error.data.message && error.data.message}
          </h3>
        )}

        <div className="right_section_temp4 w-100">
          <div
            className="d-flex flex-column align-items-center justify-content-start mb-5"
            style={{ minHeight: "calc(100vh - 126px)" }}
          >
            <div className="items_temp4"
               style={{
                flexDirection: language === "en" ? "row" : "row-reverse",
              }}
            >
              {pending ? (
                <p className="w-100 text-center mt-5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                  </div>
                </p>
              ) : items.length > 0 ? (
                items
                .map((item) => {
                  return (
                    <Fragment key={item.id}>
                      <div
                        className="item_temp4"
                        // key={item.id}
                        onClick={() => handleShow(item)}
                        style={{
                          border: `3px solid #${
                            adminDetails &&
                            adminDetails.color &&
                            adminDetails.color.substring(10, 16)
                          }`,
                        }}
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
                        height: "200px",
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
                            height= "100%"
                            className="temp2_item_image"
                            style={{
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.35)", 
                            }}
                          /> </> 
                        )}
                       
                        <h6
                          className="px-1 text-break text-truncate text-capitalize itemColor font"
                          style={{
                            direction: language === "en" ? "ltr" : "rtl",
                            fontFamily: adminDetails?.font_category,
                            fontSize:`${adminDetails.font_size_category}em`??'',
                            fontWeight:adminDetails?.font_bold_category?'bold':'none',
                          }}
                        >
                      {localStorage.getItem('language')=="en"?item.name_en:item.name_ar}
                          {/* {item.name} */}
                        </h6>
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

            {pageCountItems > 1 ? (
              <div className="m-auto" style={{flex: '1', display: 'flex', alignItems:'end'}}>
                <Pagination pageCount={pageCountItems} onPress={onPress} />
              </div>
            ) : null}
          </div>
          <Footer/>

          <SearchInput
            showModal={showModalSearch}
            handleClose={handleCloseSearch}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            language={language}
          />
          
        </div>
      </div>
      {
        showModal && 
        <DetailedItemModal
          adminDetails={adminDetails}
          item={selectedItem}
          onHide={()=>setShowModal(false)}
          show={showModal}
        />
      }
      <ToastContainer />
    </div>
  );
};

export default Temp4Items;
