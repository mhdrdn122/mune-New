import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdvertismentsContext } from "../../../context/AdvertismentsProvider";
// import test from "../../assets/heee.png";
import { AdminContext } from "../../../context/AdminProvider";
import { LanguageContext } from "../../../context/LanguageProvider";
import { Modal, ModalBody } from "react-bootstrap";
import { MdCancel } from "react-icons/md";

// import arrLeft from "../assets/Arrow 4.png";
// import arrRight from "../assets/Arrow 5.png";

export default function AdvTemp2({ num }) {
  // const [advertisments, setAdvertisments] = useState([]);

  const { advertisments } = useContext(AdvertismentsContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(null);
  const handleShow = (item) => setShowModal(item);

  useEffect(() => {
    // async function getAdvertisments() {
    //   try {
    //     const response = await axios.get(
    //       "https://api.menu.sy/user_api/show_advertisements?adminId=1"
    //     );
    //     // console.log(response);
    //     setAdvertisments(response.data.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // getAdvertisments();
  }, []);

  const settings = {
    dots: false,
    infinite: advertisments.length < 3 ? false : true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // slidesToShow: advertisments?.length < 3 ? 2 : advertisments?.length < 4 ? advertisments?.length : 4,
    // slidesToScroll: advertisments?.length < 3 ? 2 : advertisments?.length < 4 ? advertisments?.length :4,
    autoplay: true,
    autoplaySpeed: 2000,
    waitForAnimate: true,
    adaptiveHeight: false,
    rtl: language === "en" ? false : true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          infinite: advertisments.length === 1 ? false : true,
          slidesToShow: num,
          slidesToScroll: num,
        },
      },
    ],
  };

  return (
    <div className="my-3">
      <Slider {...settings}>
        {advertisments &&
          advertisments.map((adv) => (
            <div className="product product_temp2 mt-0" key={adv.id}>
              <img
                src={adv.image}
                alt="advertisment"
                className=""
                onClick={() => handleShow(adv)}
              />
            </div>
          ))}

        <Modal
          show={showModal}
          onHide={handleClose}
          className="itemModal"
          centered
        >
          <ModalBody className="p-0">
            <div className="details_item">
              <img style={{aspectRatio: 3/2}} src={showModal && showModal.image} alt="" className="" />

              <span>
                <MdCancel
                  style={{ color: "#FFF" }}
                  className="cancel_button"
                  onClick={handleClose}
                />
              </span>

              <div className="details">
                <div className="mt-3 w-100">
                  <h3 className="text-capitalize text-center text-break font">
                    {showModal && showModal.title}
                  </h3>
                  <p
                    className="text-center font"
                    style={{ fontSize: "20px", color: "#000" }}
                  >
                    {`From: ${showModal && showModal.from_date}`}
                  </p>
                  <p className="text-dark text-center text-break  text-capitalize mt-3 font">
                    {`To: ${showModal && showModal.to_date}`}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Slider>
    </div>
  );
}
