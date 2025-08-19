// Optimized and cleaned-up version of RatesContainer
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import StarRatings from "react-star-ratings";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useMediaQuery } from "@uidotdev/usehooks";
import { FaEye } from "react-icons/fa";

import {
  getAllRatesAction,
  resetSuccess,
} from "../../redux/slice/rates/ratesSlice";
import Pagination from "../../utils/Pagination";
import "./ratesContainer.css";
import RatingCard from "../../components/Admin/rates/RatingCard";

const RatesContainer = ({ refresh, mode }) => {
  const dispatch = useDispatch();
  const { rates, loading, error } = useSelector((state) => state.rates);
  const nowDate = new Date().toISOString().slice(0, 10);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [page, setPage] = useState(1);
  const [showModalRate, setShowModalRate] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

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

  useEffect(() => {}, [refresh]);
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

  const renderFilterInputs = () => {
    switch (selectedFilter) {
      case "date":
        return (
          <Fragment>
            <label htmlFor="from_date">:من تاريخ</label>
            <input
              type="date"
              id="from_date"
              value={filterParams.from_date}
              onChange={handleChange}
              className="w-100 rounded p-1"
            />
            <label htmlFor="to_date">:الى تاريخ</label>
            <input
              type="date"
              id="to_date"
              value={filterParams.to_date}
              onChange={handleChange}
              className="w-100 rounded p-1"
            />
          </Fragment>
        );
      case "age":
        return (
          <Fragment>
            <label htmlFor="from_age">:من عمر</label>
            <input
              type="number"
              id="from_age"
              value={filterParams.from_age}
              onChange={handleChange}
              className="w-100 rounded p-1"
            />
            <label htmlFor="to_age">:الى عمر</label>
            <input
              type="number"
              id="to_age"
              value={filterParams.to_age}
              onChange={handleChange}
              className="w-100 rounded p-1"
            />
          </Fragment>
        );
      case "rate":
        return (
          <ReactStars
            count={3}
            onChange={(val) =>
              setFilterParams((prev) => ({ ...prev, rate: val }))
            }
            size={30}
            activeColor="#ffd700"
            value={filterParams.rate}
          />
        );
      case "gender":
        return (
          <Fragment>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={filterParams.gender === "male"}
                onChange={handleChange}
              />{" "}
              ذكر
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={filterParams.gender === "female"}
                onChange={handleChange}
              />{" "}
              انثى
            </label>
          </Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <Row
        className="px-4 pb-4"
        style={{ flexDirection: "row-reverse", alignItems: "center" }}
      >
        <Col lg={3} className="mb-2">
          <div className="form_filter">
            <label htmlFor="filter_type">: حدد نوع الفلترة</label>
            <select
              id="filter_type"
              onChange={handleSelectedFilterChange}
              className="w-100 p-2 rounded"
              dir="rtl"
            >
              <option value="">الكل</option>
              <option value="date">التاريخ</option>
              <option value="age">العمر</option>
              <option value="rate">التقييم</option>
              <option value="gender">الجنس</option>
            </select>
          </div>
          {renderFilterInputs()}
        </Col>
        <Col>
          <div className="d-flex justify-content-start">
            {["unknown", "person"].map((type) => (
              <Button
                key={type}
                size={isSmallDevice ? "small" : "large"}
                variant={filterParams.type === type ? "contained" : "outlined"}
                
                sx={{ mr: 1 }}
                onClick={() => setFilterParams((prev) => ({ ...prev, type }))}
              >
                {type === "unknown"
                  ? "التقييمات الغير معروفة"
                  : "التقييمات المعروفة"}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      <div className="w-full flex flex-wrap items-center gap-3 justify-center">
        {rates &&
          !mode &&
          rates?.data?.map((rate, index) => {
            return <RatingCard data={rate} onClick={() => openModal(rate)} />;
          })}
      </div>

      {rates?.data?.length <= 0 && !mode && (
        <p className="fw-bold text-center text-[#2F4B26]">لا توجد بيانات</p>
      )}



      {mode && (
        <div className="table-responsive table_container">
          <table className="table " dir="rtl">
            <thead>
              <tr>
                <th className="!bg-[#2F4B26]">الاسم</th>
                <th className="!bg-[#2F4B26]">الملاحظة</th>
                <th className="!bg-[#2F4B26]">الرقم</th>
                <th className="!bg-[#2F4B26]">الجنس</th>
                <th className="!bg-[#2F4B26]">العمر</th>
                <th className="!bg-[#2F4B26]">التقييم</th>
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
                      <div className="d-flex justify-content-center">
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
