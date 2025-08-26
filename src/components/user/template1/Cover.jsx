import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useContext } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { AdminContext } from "../../../context/AdminProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
export default function Cover() {
  const { adminDetails, updateUsername } = useContext(AdminContext);
    console.log(adminDetails.logo) 

  return (
    // <Swiper
    //   spaceBetween={30}
    //   centeredSlides={true}
    //   autoplay={{
    //     delay: 4000,
    //     disableOnInteraction: false,
    //     pauseOnMouseEnter:true,
    //     stopOnLastSlide:false
    //   }}
    //   loop={true}
    //   modules={[Autoplay]}
    //   className="!w-full h-[300px] md:h-[500px]"
    // >
    //   <SwiperSlide className="!w-full !h-full rounded-2xl">
    //     <LazyLoadImage
    //       src={adminDetails?.cover}
    //       alt="cover"
    //       width={"100%"}
    //       height={"100%"}
    //       effect="blur"
    //       className="!h-full"
    //     />
    //   </SwiperSlide>
    //   <SwiperSlide className="!w-full !h-full rounded-2xl">
    //     {adminDetails?.is_rate === 1 && (
    //       <Link
    //         to={`/${adminDetails.name_url}/rating`}
    //         className="!w-full !h-full relative flex flex-col justify-center items-center rounded-2xl"
    //         style={{
    //           backgroundColor: `rgba(255,255,255,${adminDetails.rate_opacity || 1})`,
    //         }}
    //       >
    //         {/* Absolute "Rate Us" header */}
    //         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
    //           <h3 className="text-lg font-bold text-gray-800">Rate Us</h3>
    //         </div>

    //         {/* Rating images */}
    //         <div className="flex justify-center items-center gap-5  p-4 w-full mt-16 ">
    //           <img src={adminDetails?.bad_image} alt="" className="!w-[200px] !hidden md:!block object-contain" />
    //           <img src={adminDetails?.good_image} alt="" className="!w-[200px] !hidden md:!block object-contain" />
    //           <img src={adminDetails?.perfect_image} alt="Perfect" className="!w-[200px] object-contain" />
    //         </div>
    //       </Link>
    //     )}
    //   </SwiperSlide>
    // </Swiper>

    <div className="relative ">
      <img
        style={{
          borderRadius: "40px 40px",
        }}
        src={adminDetails.cover}
        className="w-full  px-2 my-3 shadow-lg  object-cover min-h-[300px] max-h-[250px] md:max-h-[500px] "
        alt="cover_restaurant"
      />

      <img
        style={{
          borderRadius: "50%",
          transform: "translate(-50%)",
        }}
        src={adminDetails.logo}
        className=" absolute bottom-[-50px] md:bottom-[-50px] left-[50%] border-4  object-cover w-[150px] md:w-[200px] h-[150px] md:h-[200px] "
        alt="cover_restaurant"
      />

      <div
        className="w-100 d-flex justify-content-start"
        style={{ gap: "15px", paddingLeft: "15px" }}
      >
        {adminDetails.facebook_url && (
          <div className="d-flex align-items-center social">
            <Link target="_blank" to={adminDetails.facebook_url}>
              <FaFacebookF
                className="p-2"
                color="white"
                style={{
                  background: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  opacity: adminDetails.home_opacity || 1,
                }}
              />
            </Link>
          </div>
        )}
        {adminDetails.instagram_url && (
          <div className="d-flex align-items-center social">
            <Link target="_blank" to={adminDetails.instagram_url}>
              <AiOutlineInstagram
                className="p-2"
                color="white"
                style={{
                  backgroundColor: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  opacity: adminDetails.home_opacity || 1,
                }}
              />
            </Link>
          </div>
        )}
        {adminDetails.whatsapp_phone && (
          <div className="d-flex align-items-center justify-content-center  social">
            <Link
              target="_blank"
              to={`https://wa.me/+963${adminDetails.whatsapp_phone.substring(
                0
              )}`}
            >
              <AiOutlineWhatsApp
                className="p-2"
                color="white"
                style={{
                  backgroundColor: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  opacity: adminDetails.home_opacity || 1,
                }}
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
