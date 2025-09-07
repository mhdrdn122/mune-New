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
import DynamicSkeleton from "../../../utils/DynamicSkeletonProps";
import { MdFacebook } from "react-icons/md";
export default function Cover() {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  console.log(adminDetails.logo)

  return (

    <div className="relative ">

      {
        adminDetails.cover ? (
          <img
            style={{
              borderRadius: "40px 40px",
            }}
            src={adminDetails.cover}
            className="w-full  px-2 my-3   object-cover   max-h-[200px] md:max-h-[500px] "
            alt="cover_restaurant"
          />
        ) : (
          <div className="p-2 overflow-hidden">
            <DynamicSkeleton
              count={1}
              variant="rounded"
              height={350}
              animation="wave"
              spacing={3}
              columns={{ xs: 12, sm: 12, md: 12 }}

            />
          </div>

        )

      }



      {
        adminDetails.logo ? (
          <img
            style={{
              borderRadius: "50%",
              transform: "translate(-50%)",
            }}
            src={adminDetails.logo}
            className=" absolute bottom-[-20px] md:bottom-[-50px] left-[50%] border-0  object-cover w-[150px] md:w-[200px] h-[150px] md:h-[200px] "
            alt="cover_restaurant"
          />
        ) : (
          <div
            style={{
              borderRadius: "50%",
              transform: "translate(-50%)",
              borderRadius: "50%",
              overflow: "hidden"
            }}
            className=" absolute bottom-[-50px] md:bottom-[-50px] left-[50%] border-0  object-cover w-[150px] md:w-[200px] h-[150px] md:h-[200px] "
          >
            <DynamicSkeleton
              count={1}
              variant="rounded"
              height={200}
              animation="wave"
              spacing={3}
              columns={{ xs: 12, sm: 12, md: 12 }}

            />
          </div>

        )

      }




      <div
        className="w-full flex justify-between md:!justify-start"
        style={{ gap: "15px", padding: "0 10px" }}
      >
        <div className="flex items-center gap-2">
          {adminDetails.facebook_url && (
            <div className="d-flex align-items-center social">
              <Link target="_blank" to={adminDetails.facebook_url}>
                <MdFacebook
                  className="p-1"
                  color="white"
                  style={{
                    background: `#${adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                      }`,
                    width: "40px",
                    height: "40px",
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
                  className="p-1"
                  color="white"
                  style={{
                    backgroundColor: `#${adminDetails &&
                      adminDetails.color &&
                      adminDetails.color.substring(10, 16)
                      }`,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    opacity: adminDetails.home_opacity || 1,
                  }}
                />
              </Link>
            </div>
          )}
        </div>

        {adminDetails.whatsapp_phone && (
          <div className="d-flex align-items-center justify-content-center  social">
            <Link
              target="_blank"
              to={`https://wa.me/+963${adminDetails.whatsapp_phone.substring(
                0
              )}`}
            >
              <AiOutlineWhatsApp
                className="p-1"
                color="white"
                style={{
                  backgroundColor: `#${adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                    }`,
                  width: "40px",
                  height: "40px",
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
