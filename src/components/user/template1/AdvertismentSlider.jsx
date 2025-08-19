import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useState } from "react";
import { AdvertismentsContext } from "../../../context/AdvertismentsProvider";
import { Modal, ModalBody } from "react-bootstrap";
import { MdCancel } from "react-icons/md";
import ReactPannellum from "react-pannellum";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function AdvertismentSlider() {
  const { advertisments } = useContext(AdvertismentsContext);
  const [showModal, setShowModal] = useState(null);
  const handleClose = () => setShowModal(null);
  const handleShow = (item) => setShowModal(item);

  const config = {
    autoRotate: -10,
    autoLoad: true,
    compass: false,
    showZoomCtrl: false,
    showControls: false,
  };

  return (
    advertisments.length > 0 && (
      <div className="relative w-full py-4 px-2 sm:px-4">
        {/* Slider Container */}
        <div className="relative w-full flex items-center justify-center">
          <Swiper
            spaceBetween={10}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
            }}
            loop={true}
            loopAdditionalSlides={2}
            navigation={{ enabled: true }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, Navigation, Pagination]}
            className="w-full"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
            }}
          >
            {advertisments?.map((adv) => (
              <SwiperSlide
                key={adv.id}
                className="flex items-center justify-center"
              >
                <div className="relative w-full aspect-square max-w-[300px] mx-auto p-1 sm:p-2">
                  {adv.is_panorama ? (
                    <div
                      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                      onClick={() => handleShow(adv)}
                    >
                      <ReactPannellum
                        key={`pannellum-${adv.id}`}
                        id={`pannellum-${adv.id}`}
                        sceneId={`scene-${adv.id}`}
                        imageSource={adv.image}
                        config={config}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                      onClick={() => handleShow(adv)}
                    >
                      <img
                        src={adv.image}
                        alt="advertisement"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Modal for Advertisement Details */}
        <Modal
          show={showModal}
          onHide={handleClose}
          className="itemModal"
          centered
          size="lg"
        >
          <ModalBody className="p-0 bg-white rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={showModal?.image}
                alt="Advertisement"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                aria-label="Close"
              >
                <MdCancel className="text-white text-2xl" />
              </button>
              <div className="p-4">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-4">
                  {showModal?.title}
                </h3>
                {showModal?.hide_date === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="font-semibold">From:</p>
                      <p>{showModal?.from_date}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="font-semibold">To:</p>
                      <p>{showModal?.to_date}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  );
}
