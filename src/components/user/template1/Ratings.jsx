import { Link, useNavigate, useParams } from "react-router-dom"; 
import {   Form,   Spinner, Button } from "react-bootstrap";
import { Fragment, useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/AdminProvider";
import axios from "axios";
 import { LanguageContext } from "../../../context/LanguageProvider";
// import notFound from "../../../assets/User/pngegg(14).png";
 import "react-lazy-load-image-component/src/effects/blur.css";
import notify from "../../../utils/useNotification";
import { ToastContainer } from "react-toastify"; 
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import StarRatings from "react-star-ratings";
import NavBarUser from "../../../utils/user/NavBarUser";
import { useMediaQuery } from "@mui/material";

const Ratings = () => {
  const [showModal, setShowModal] = useState(false);
  const [afterRate, setAfterRate] = useState(true);
  const { username } = useParams();
  const { adminDetails, updateUsername, loading, error } =
    useContext(AdminContext);
  const navigate = useNavigate();
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedGender, setSelectedGender] = useState("male");
  const [selectedType, setSelectedType] = useState("person");
  const [rate, setRate] = useState(null);
  const [isValid, setIsValid] = useState("");
  const [selectImg, setSelectImg] = useState(1);
  const [isPress, setIsPress] = useState(false);
  const { language } = useContext(LanguageContext);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [ratings, setRatings] = useState({
    sweets: 0,
    food: 0,
    service: 0,
    kidsRoom: 0,
    drinks: 0,
    arakel: 0,
  });

  const handleUpdateUsername = () => {
    updateUsername(username);
  };

  useEffect(() => {
    setTimeout(() => {
      handleUpdateUsername();
    }, 300);
  }, []);

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setSelectedType("person");
    setStep(step - 1);
  };

  const handlePhoneChange = (event) => {
    setPhoneNumber(event.target.value);
    setIsValid(true);
  };

  const handleCheckboxChangeType = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedType === "person") {
      if (!phoneNumber || !name || !age || !selectedGender) {
        return;
      }
    }

    try {
      setIsPress(true);
      const response = await axios.post(
        `${baseURLLocalPublic}/customer_api/add_rate`,
        {
          note: notes,
          phone: phoneNumber,
          name,
          birthday: age,
          gender: selectedGender,
          type: selectedType,
          rate,
          service: ratings.service,
          arakel: ratings.arakel,
          foods: ratings.food,
          drinks: ratings.drinks,
          sweets: ratings.sweets,
          games_room: ratings.kidsRoom,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setIsPress(false);
      notify(response.data.message, "success");
      setNotes("");
      setPhoneNumber("");
      setName("");
      setAge("");
      setStep(1);
      setSelectedType("person");
      handleClose();
      setIsValid(false);
    } catch (e) {
      setIsPress(false);
      notify(e.response.data.message, "error");
    }
  };

  const ratingsData = [
    { key: "sweets", ar: "الحلويات", en: "sweets" },
    { key: "food", ar: "الطعام", en: "food" },
    { key: "service", ar: "الخدمة", en: "service" },
    { key: "kidsRoom", ar: "غرفة الألعاب", en: "child room" },
    { key: "drinks", ar: "المشروبات", en: "drinks" },
    { key: "arakel", ar: "الأراكيل", en: "arakel" },
  ];

  const handleRatingChange = (newRating, name) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [name]: newRating,
    }));
  };

  return (
    <div
      style={{ minHeight: "140vh" }}
      className=" pt-20 md:p-0 md:h-auto pb-30   bgColor"
    >
      {loading === false ? (
        adminDetails && Object.keys(adminDetails).length > 0 ? (
          <Fragment>
            <NavBarUser />
            {adminDetails?.rate_format === 0 && (
              <div className="description">
                <h3
                  className="font"
                  style={{
                    color: `#${adminDetails?.f_color_rating?.substring(
                      10,
                      16
                    )}`,
                  }}
                >
                  Rate your experience
                </h3>
                <div className="d-flex justify-content-center align-items-center w-75 w-lg-50 gap-2">
                  <img
                    src={adminDetails?.bad_image}
                    alt="bad experience"
                    onClick={() => {
                      handleShow();
                      setAfterRate(false);
                      setSelectImg(1);
                      setRate(1);
                    }}
                  />
                  <img
                    src={adminDetails?.good_image}
                    alt="good experience"
                    onClick={() => {
                      handleShow();
                      setAfterRate(false);
                      setSelectImg(2);
                      setRate(2);
                    }}
                  />
                  <img
                    src={adminDetails?.perfect_image}
                    alt="perfect experience"
                    onClick={() => {
                      handleShow();
                      setAfterRate(true);
                      setSelectImg(3);
                      setRate(3);
                    }}
                  />
                </div>
                <Link
                  to={`/${username}/template/${adminDetails?.menu_template_id}/home`}
                >
                  <Button
                    style={{
                      backgroundColor: `#${adminDetails.color?.substring(
                        10,
                        16
                      )}`,
                    }}
                    className="font"
                  >
                    Next
                  </Button>
                </Link>
              </div>
            )}
            {adminDetails?.rate_format === 1 && (
              <>
                <h3
                  className="text-center mt-4"
                  style={{
                    color: `#${adminDetails?.f_color_rating?.substring(
                      10,
                      16
                    )}`,
                  }}
                >
                  Rate your experience
                </h3>
                <div
                  className="container_rateFormat p-2 w-full"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {ratingsData.map((item) => (
                    <div
                      key={item.key}
                      className={` bg-[#d4f989c7]  flex items-center ${
                        isSmallDevice ? "w-full " : "w-50 "
                      }   justify-between`}
                      style={{
                        border: `1px solid #${adminDetails?.color?.substring(
                          10,
                          16
                        )}`,
                        padding: "15px",
                        borderRadius: "8px",
                        display: "flex",
                        // flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div className="service-title  text-center  md:flex-1">
                        {language === "en" ? (
                          <p>{item.en}</p>
                        ) : (
                          <p>{item.ar}</p>
                        )}
                      </div>

                      <div
                        className="rating-controls flex-1"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <div
                          className="rate-words"
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <span>سيئ</span>
                          <span>وسط</span>
                          <span>ممتاز</span>
                        </div>

                        <div
                          className="stars-container"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <StarRatings
                            starRatedColor="yellow"
                            numberOfStars={3}
                            rating={ratings[item.key]}
                            changeRating={(newRating) =>
                              handleRatingChange(newRating, item.key)
                            }
                            starDimension="20px"
                            starSpacing="40px"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rateModal2 w- p-2 ">
                  <Form
                    className="!w-100 !shadow-none container_rate container_rate2 bg- "
                    style={{
                      height: `${
                        selectedType === "anonymous" ? "50px" : "120px"
                      }`,
                      // borderColor: `#${adminDetails?.color?.substring(10, 16)}`,
                      // boxShadow: `#${adminDetails?.color?.substring(
                      //   10,
                      //   16
                      // )} 2.5px 2.5px 2.5px`,
                    }}
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {step === 1 && (
                      <div className="w-100 flex flex-col p-2 ">
                        <label className="font mb-2">Your notes:</label>
                        <input
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          type="text"
                          className="border-1 rounded"
                        />
                        <label style={{ marginTop: "15px" }} className="font">
                          Phone number:
                        </label>
                        <input
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          type="number"
                          placeholder=""
                          className="border-1 rounded"
                          required
                        />
                        {isValid === "" ? (
                          ""
                        ) : isValid ? (
                          <p style={{ color: "green" }} className="font">
                            Phone number is valid!
                          </p>
                        ) : (
                          <p style={{ color: "red" }} className="font">
                            Phone number is not valid
                          </p>
                        )}
                      </div>
                    )}
                    {step === 2 && (
                      <div className="w-100 flex flex-col p-2 ">
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            id="personCheckbox "
                            value="person"
                            className=""
                            checked={selectedType === "person"}
                            onChange={handleCheckboxChangeType}
                          />
                          <label htmlFor="personCheckbox" className="font px-2">
                            Person
                          </label>
                          <input
                            type="checkbox"
                            id="anonCheckbox"
                            value="anonymous"
                            checked={selectedType === "anonymous"}
                            onChange={handleCheckboxChangeType}
                            className=""
                          />
                          <label htmlFor="anonCheckbox" className="font px-2">
                            Anonymous
                          </label>
                        </div>
                        {selectedType === "person" && (
                          <Fragment>
                            <div className="d-flex">
                              <input
                                type="checkbox"
                                id="maleCheckbox"
                                value="male"
                                className=""
                                checked={selectedGender === "male"}
                                onChange={(e) =>
                                  setSelectedGender(e.target.value)
                                }
                              />
                              <label
                                htmlFor="maleCheckbox"
                                className="font px-2"
                              >
                                Male
                              </label>
                              <input
                                type="checkbox"
                                id="femaleCheckbox"
                                value="female"
                                checked={selectedGender === "female"}
                                onChange={(e) =>
                                  setSelectedGender(e.target.value)
                                }
                              />
                              <label
                                htmlFor="femaleCheckbox"
                                className="font px-2"
                              >
                                Female
                              </label>
                            </div>
                            <label className="font">Name:</label>
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              type="text"
                              className="border-1 rounded"
                            />
                            <label className="font">Age:</label>
                            <input
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              type="number"
                              className="border-1 rounded"
                            />
                          </Fragment>
                        )}
                      </div>
                    )}
                    <div className="d-flex">
                      {step > 1 && (
                        <Button
                          onClick={handlePreviousStep}
                          className="font mx-2"
                          style={{
                            backgroundColor: `#${adminDetails?.color?.substring(
                              10,
                              16
                            )}`,
                          }}
                        >
                          Previous
                        </Button>
                      )}
                      {step < 2 ? (
                        isValid ? (
                          <Button
                            onClick={handleNextStep}
                            className="font mx-2"
                            style={{
                              backgroundColor: `#${adminDetails?.color?.substring(
                                10,
                                16
                              )}`,
                            }}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            disabled
                            className="font mx-2"
                            style={{
                              backgroundColor: `#${adminDetails?.color?.substring(
                                10,
                                16
                              )}`,
                            }}
                          >
                            Next
                          </Button>
                        )
                      ) : isPress ? (
                        <Button
                          disabled
                          className="font"
                          style={{
                            backgroundColor: `#${adminDetails?.color?.substring(
                              10,
                              16
                            )}`,
                          }}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          className="mx-2 btn font"
                          style={{
                            backgroundColor: `#${adminDetails?.color?.substring(
                              10,
                              16
                            )}`,
                          }}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>
                <Link
                  className="d-flex justify-content-center mt-2"
                  to={`/${username}/template/${adminDetails?.menu_template_id}/home`}
                >
                  <Button
                    style={{
                      backgroundColor: `#${adminDetails?.color?.substring(
                        10,
                        16
                      )}`,
                    }}
                    className="font"
                  >
                    Home
                  </Button>
                </Link>
              </>
            )}
          </Fragment>
        ) : (
          <div className=" h-100">
            <div className="alert alert-primary mb-5" role="alert">
              {error?.message}
            </div>
            <img src={"../../../assets/User/pngegg(14).png"} className=" w-100 h-75" />
          </div>
        )
      ) : (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <Button variant="primary" disabled>
            Loading...
          </Button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Ratings;
