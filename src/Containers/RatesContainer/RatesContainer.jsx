// Optimized and cleaned-up version of RatesContainer
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import StarRatings from "react-star-ratings";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useMediaQuery } from "@uidotdev/usehooks";
import { FaEye, FaFilter } from "react-icons/fa";

import {
  getAllRatesAction,
  resetSuccess,
} from "../../redux/slice/rates/ratesSlice";
import Pagination from "../../utils/Pagination";
import "./ratesContainer.css";
import RatingCard from "../../components/Admin/rates/RatingCard";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";
import useGetStyle from "../../hooks/useGetStyle";

const RatesContainer = ({ refresh, mode }) => {
  const dispatch = useDispatch();
  const { rates, loading, error } = useSelector((state) => state.rates);
  const nowDate = new Date().toISOString().slice(0, 10);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [page, setPage] = useState(1);
  const [showModalRate, setShowModalRate] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const { Color } = useGetStyle();

  const [filterParams, setFilterParams] = useState({
    from_date: "2024-01-01",
    to_date: nowDate,
    from_age: "",
    to_age: "",
    type: "person",
    rate: 0,
    gender: "",
  });

  useEffect(() => {
    dispatch(
      getAllRatesAction({
        adminId: adminInfo?.id,
        fromDate: filterParams.from_date,
        toDate: filterParams.to_date,
        from_age: filterParams.from_age,
        to_age: filterParams.to_age,
        type: filterParams.type,
        rate: filterParams.rate,
        gender: filterParams.gender,
        resId: adminInfo?.restaurant_id,
        page,
      })
    );
  }, [dispatch, filterParams, page]);

  useEffect(() => {
    console.log("test");
  }, [refresh]);

  const handleChange = (e) => {
    const { name, id, value } = e.target;
    setFilterParams((prev) => ({
      ...prev,
      [name || id]: value,
    }));
    dispatch(resetSuccess());
  };

  const handleSelectedFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    if (!value) {
      setFilterParams({
        from_date: "2024-01-01",
        to_date: nowDate,
        from_age: "",
        to_age: "",
        type: "",
        rate: 0,
        gender: "",
      });
      dispatch(resetSuccess());
    }
  };

  const openModal = (item) => setShowModalRate(item);
  const closeModal = () => setShowModalRate(false);
  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);
  const resetFilterModal = () => {
    setFilterParams({
      from_date: "2024-01-01",
      to_date: nowDate,
      from_age: "",
      to_age: "",
      type: "person",
      rate: 0,
      gender: "",
    })
    toggleFilterModal()
  }


  const renderFilterInputs = () => {
    switch (selectedFilter) {
      case "":
        return () => resetFilterModal;

      case "date":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                style={{
                  color: Color ? "#" + Color : "#2F4B26",
                }}
                htmlFor="from_date"
                className="block text-sm font-medium  mb-1"
              >
                :من تاريخ
              </label>
              <input
                type="date"
                id="from_date"
                value={filterParams.from_date}
                onChange={handleChange}
                style={{
                  border: ` 1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                }}
                className="w-full p-2 rounded-lg border   focus:outline-none focus:ring-2 focus:ring-[#2F4B26] bg-white transition-all"
              />
            </div>
            <div>
              <label
                style={{
                  color: Color ? "#" + Color : "#2F4B26",
                }}
                htmlFor="to_date"
                className="block text-sm font-medium   mb-1"
              >
                :إلى تاريخ
              </label>
              <input
                type="date"
                id="to_date"
                style={{
                  border: ` 1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                }}
                value={filterParams.to_date}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border   focus:outline-none focus:ring-2 focus:ring-[#2F4B26] bg-white transition-all"
              />
            </div>
          </div>
        );
      case "age":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                style={{
                  color: Color ? "#" + Color : "#2F4B26",
                }}
                htmlFor="from_age"
                className="block text-sm font-medium   mb-1"
              >
                :من عمر
              </label>
              <input
                type="number"
                id="from_age"
                style={{
                  border: ` 1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                }}
                value={filterParams.from_age}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#2F4B26] bg-white transition-all"
              />
            </div>
            <div>
              <label
                style={{
                  color: Color ? "#" + Color : "#2F4B26",
                }}
                htmlFor="to_age"
                className="block text-sm font-medium   mb-1"
              >
                :إلى عمر
              </label>
              <input
                type="number"
                style={{
                  border: ` 1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                }}
                id="to_age"
                value={filterParams.to_age}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border   focus:outline-none focus:ring-2 focus:ring-[#2F4B26] bg-white transition-all"
              />
            </div>
          </div>
        );
      case "rate":
        return (
          <div className="flex flex-col items-start">
            <label
              style={{
                color: Color ? "#" + Color : "#2F4B26",
              }}
              className="block text-sm font-medium   mb-1"
            >
              :التقييم
            </label>
            <ReactStars
              count={3}
              onChange={(val) =>
                setFilterParams((prev) => ({ ...prev, rate: val }))
              }
              size={30}
              activeColor="#ffd700"
              value={filterParams.rate}
              className="mt-2"
            />
          </div>
        );
      case "gender":
        return (
          <div className="flex flex-col items-start">
            <label
              style={{
                color: Color ? "#" + Color : "#2F4B26",
              }}
              className="block text-sm font-medium text-[#2F4B26] mb-1"
            >
              :الجنس
            </label>
            <div className="flex gap-6 mt-2">
              <label
                style={{
                  color: Color ? "#" + Color : "#2F4B26",
                }}
                className="flex items-center gap-2 text-[#2F4B26]"
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  style={{
                    border: ` 1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                  }}
                  checked={filterParams.gender === "male"}
                  onChange={handleChange}
                  className="form-check-input accent-[#2F4B26]"
                />
                ذكر
              </label>
              <label
                style={{
                  color: Color ? "#" + Color : "#2F4B26",
                }}
                className="flex items-center gap-2 text-[#2F4B26]"
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  style={{
                    border: ` 1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                  }}
                  checked={filterParams.gender === "female"}
                  onChange={handleChange}
                  className="form-check-input accent-[#2F4B26]"
                />
                أنثى
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && !showFilterModal) {
    return (
      <div className="flex justify-content-center gap-2 !flex-wrap">
        <DynamicSkeleton
          count={5}
          variant="rounded"
          height={250}
          animation="wave"
          spacing={3}
          columns={{ xs: 12, sm: 6, md: 3 }}
        />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="px-4 pb-4 relative">
        <Row className="g-4" style={{ flexDirection: "row-reverse" }}>
          <Col xs={12} className="flex justify-content-end">
            <Button
              onClick={toggleFilterModal}
              variant="contained"
              sx={{
                backgroundColor: Color ? "#" + Color : "#2F4B26",
                color: "#fff",
                borderRadius: "50%",
                minWidth: "48px",
                height: "48px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: Color ? Color : "#2F4B26/90",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <FaFilter size={20} />
            </Button>
          </Col>
          <Col xs={12} className="flex flex-wrap gap-3 justify-end">
            {["anonymous", "person"].map((type) => (
              <Button
                key={type}
                size={isSmallDevice ? "small" : "large"}
                variant={filterParams.type === type ? "contained" : "outlined"}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  backgroundColor:
                    filterParams.type === type
                      ? Color
                        ? Color
                        : "#2F4B26"
                      : "transparent",
                  border: `1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                  color:
                    filterParams.type === type
                      ? "#fff"
                      : Color
                        ? Color
                        : "#2F4B26",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      filterParams.type === type
                        ? Color
                          ? Color
                          : "#2F4B26"
                        : "#2F4B26/10",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => setFilterParams((prev) => ({ ...prev, type }))}
              >
                {type === "anonymous"
                  ? "التقييمات الغير معروفة"
                  : "التقييمات المعروفة"}
              </Button>
            ))}
          </Col>
        </Row>

        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg animate-slide-in">
              <div className="flex justify-between items-center mb-4">
                <h3
                  style={{
                    color: Color ? "#" + Color : "#2F4B26",
                  }}
                  className="text-lg font-semibold  "
                >
                  إعدادات الفلترة
                </h3>
                <Button
                  onClick={toggleFilterModal}
                  sx={{
                    color: Color ? "#" + Color : "#2F4B26",
                    minWidth: "40px",
                    padding: 0,
                    "&:hover": {
                      backgroundColor: Color ? Color : "#2F4B26/10",
                    },
                  }}
                >
                  ✕
                </Button>
              </div>
              <div className="form_filter">
                <label
                  style={{
                    color: Color ? "#" + Color : "#2F4B26",
                  }}
                  htmlFor="filter_type"
                  className="block text-sm font-semibold   mb-2"
                >
                  :حدد نوع الفلترة
                </label>
                <select
                  id="filter_type"
                  style={{
                    border: `1px solid ${Color ? "#" + Color : "#2F4B26"}`,
                  }}
                  onChange={handleSelectedFilterChange}
                  className="w-full p-2.5 rounded-lg border   focus:outline-none focus:ring-2 focus:ring-[#2F4B26] bg-white text-[#2F4B26] transition-all mb-4"
                  dir="rtl"
                >
                  <option value="" > حدد نوع الفلترة</option>
                  <option value="date">التاريخ</option>
                  <option value="age">العمر</option>
                  <option value="rate">التقييم</option>
                  <option value="gender">الجنس</option>
                </select>
                <div>{renderFilterInputs()}</div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  onClick={toggleFilterModal}
                  variant="contained"
                  sx={{
                    backgroundColor: Color ? "#" + Color : "#2F4B26",
                    color: "#fff",
                    px: 3,
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: Color ? "#" + Color : "#2F4B26" },
                  }}
                >
                  تطبيق
                </Button>

                <Button
                  onClick={resetFilterModal}
                  variant="contained"
                  sx={{
                    backgroundColor: "#f00",
                    color: "#fff",
                    px: 3,
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#f21" },
                  }}
                >
                  تراجع
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-wrap items-center gap-3 justify-center">
        {rates &&
          !mode &&
          rates?.data?.map((rate, index) => {
            return <RatingCard data={rate} onClick={() => openModal(rate)} />;
          })}
      </div>

      {rates?.data?.length <= 0 && !mode && (
        <p
          style={{
            color: Color ? "#" + Color : "#2F4B26",
          }}
          className="fw-bold text-center  "
        >
          لا توجد بيانات
        </p>
      )}

      {mode && (
        <div className="table-responsive table_container">
          <table className="table" dir="rtl">
            <thead>
              <tr>
                <th
                  style={{
                    background: Color ? "#" + Color : "#2F4B26",
                  }}
                  className=" "
                >
                  الاسم
                </th>
                <th
                  style={{
                    background: Color ? "#" + Color : "#2F4B26",
                  }}
                  className=" "
                >
                  الملاحظة
                </th>
                <th
                  style={{
                    background: Color ? "#" + Color : "#2F4B26",
                  }}
                  className=" "
                >
                  الرقم
                </th>
                <th
                  style={{
                    background: Color ? "#" + Color : "#2F4B26",
                  }}
                  className=" "
                >
                  الجنس
                </th>
                <th
                  style={{
                    background: Color ? "#" + Color : "#2F4B26",
                  }}
                  className=""
                >
                  العمر
                </th>
                <th
                  style={{
                    background: Color ? "#" + Color : "#2F4B26",
                  }}
                  className=" "
                >
                  التقييم
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <Spinner animation="border" />
                    <p>جار التحميل</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-danger">
                    خطأ: {error.message}
                  </td>
                </tr>
              ) : rates?.data?.length > 0 ? (
                rates.data.map((rate) => (
                  <tr key={rate.id}>
                    <td>{rate.name || "..."}</td>
                    <td>{rate.note || "..."}</td>
                    <td>{rate.phone || "..."}</td>
                    <td>{rate.gender || "..."}</td>
                    <td>{rate.birthday || "..."}</td>
                    <td>
                      <div className="!flex !justify-center gap-3 !items-center">
                        <div>
                          <ReactStars
                            count={3}
                            value={rate.rate}
                            size={isSmallDevice ? 12 : 25}
                            activeColor="#ffd700"
                            edit={false}
                          />
                        </div>
                        {adminInfo?.restaurant?.rate_format === 1 && (
                          <FaEye
                            style={{ cursor: "pointer" }}
                            onClick={() => openModal(rate)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {rates?.meta?.total_pages > 1 && (
        <Pagination onPress={setPage} pageCount={rates.meta.total_pages} />
      )}

      {showModalRate && (
        <Modal
          show={true}
          onHide={closeModal}
          centered
          style={{ direction: "rtl" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>معلومات تقييم {showModalRate.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between">
              {[
                { label: "الأراكيل", key: "arakel" },
                { label: "الحلويات", key: "sweets" },
                { label: "غرفة الألعاب", key: "games_room" },
                { label: "الخدمة", key: "service" },
                { label: "الطعام", key: "foods" },
                { label: "المشروبات", key: "drinks" },
              ].map(({ label, key }) => (
                <p key={key}>
                  {label} :{" "}
                  <StarRatings
                    rating={showModalRate[key]}
                    starDimension="25px"
                    starSpacing="7px"
                    starRatedColor="yellow"
                    numberOfStars={3}
                  />
                </p>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModal}>حسنا</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Fragment>
  );
};

export default RatesContainer;
