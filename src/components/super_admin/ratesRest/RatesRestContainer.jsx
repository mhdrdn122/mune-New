import { Col, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetRatesRestQuery } from "../../../redux/slice/super_admin/ratesRest/ratesRestApi";
import { Fragment, useState } from "react";
import ReactStars from "react-rating-stars-component";
import useDebounce from "../../../utils/useDebounce";
import { Button } from "@mui/material";
import useError401 from "../../../hooks/useError401 ";
import RefreshButton from "../../../utils/RefreshButton";
import Pagination from "../../../utils/Pagination";

const RatesRestContainer = ({randomNumber}) => {
  const { resId } = useParams();
  const [page, setPage] = useState(1)
  const nowDate = new Date().toISOString().slice(0, 10);
  const [validationError, setValidationError] = useState("");
  const [filterParams, setFilterParams] = useState({
    from_date: "",
    to_date: "",
    from_age: "",
    to_age: "",
    type: "",
    rate: "",
    gender: "",
  });
  const debouncedFilterParams = useDebounce(filterParams, 1000);

  const {
    data: rates,
    isError,
    error,
    isLoading: loading,
    refetch,
    isFetching
  } = useGetRatesRestQuery({
    page,
    resId,
    fromDate: debouncedFilterParams.from_date || "",
    toDate: debouncedFilterParams.to_date || "",
    from_age: debouncedFilterParams.from_age || "",
    to_age: debouncedFilterParams.to_age || "",
    type: debouncedFilterParams.type || "",
    rate: debouncedFilterParams.rate || "",
    gender: debouncedFilterParams.gender || "",
    randomNumber
  });

  const [selectedFilter, setSelectedFilter] = useState("");

  const { triggerRedirect } = useError401(isError, error);

  const getErrorMessage = (error) => {
    console.log(error);
    if (error?.status === "FETCH_ERROR") {
      return "Network error: Please check your internet connection.";
    } else if (error?.status >= 500) {
      return "Server error: Please try again later.";
    } else if (error?.status === 404) {
      return "Data not found: The requested resource was not found.";
    } else {
      return error?.data?.message;
    }
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilterParams({
      ...filterParams,
      [id]: value,
    });
  };

  // const handleSelectedFilterChange = (e) => {
  //   if (e.target.value === "") {
  //     setFilterParams({
  //       from_date: "",
  //       to_date: "",
  //       from_age: "",
  //       to_age: "",
  //       type: "",
  //       rate: "",
  //       gender: "",
  //     });
  //   }
  //   setSelectedFilter(e.target.value);
  // };

  const [selectedFilters, setSelectedFilters] = useState({
    date: false,
    age: false,
    rate: false,
    gender: false,
  });

  const handleSelectedFilterChange = (e) => {
    const { value } = e.target;
    if (e.target.value === "") {
      setFilterParams({
        from_date: "",
        to_date: "",
        from_age: "",
        to_age: "",
        type: "",
        rate: "",
        gender: "",
      });
      setSelectedFilters({
        date: false,
        age: false,
        rate: false,
        gender: false,
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [value]: !selectedFilters[value],
      });
    }
  };

  const onPress = (page) => {
    setPage(page);
  };

  console.log(selectedFilters);
  return (
    <div>
      <Row
        className="px-4 pb-4"
        style={{ flexDirection: "row-reverse", alignItems: "center" }}
      >
        <Col className="  col-12 col-lg-8 mb-2 mb-lg-0">
          <div className="form_filter">
            <label htmlFor="filter_type" className="mx-1">
              : حدد نوع الفلترة
            </label>
            <select
              id="filter_type"
              onChange={handleSelectedFilterChange}
              className="w-100 p-2 rounded"
              dir="rtl"
            >
              <option value="" className="p-1">
                الكل
              </option>
              <option value="date" className="p-2">
                التاريخ
              </option>
              <option value="age">العمر</option>
              <option value="rate">التقييم</option>
              <option value="gender">الجنس</option>
            </select>
          </div>

          {selectedFilters.date && (
            <div className="d-flex flex-row-reverse justify-conetent-center align-items-center mt-2">
              <label htmlFor="from_date" className="d-block w-50">
                :من تاريخ
              </label>
              <input
                type="date"
                id="from_date"
                value={filterParams.from_date}
                onChange={handleFilterChange}
                className="w-100 rounded p-1"
              />
              <label htmlFor="to_date" className="d-block w-50 mx-1">
                :الى تاريخ
              </label>
              <input
                type="date"
                id="to_date"
                value={filterParams.to_date}
                onChange={handleFilterChange}
                className="w-100 rounded p-1"
              />
              <Button
                variant="outlined"
                sx={{ mr: "10px" }}
                onClick={() => {
                  setSelectedFilters({
                    ...selectedFilters,
                    date: false,
                  });
                  setFilterParams({
                    ...filterParams,
                    from_date: "",
                    to_date: "",
                  });
                }}
              >
                الغاء
              </Button>
            </div>
          )}

          {selectedFilters.age && (
            <div className="d-flex flex-row-reverse justify-conetent-center align-items-center mt-2">
              <label htmlFor="from_age" className="d-block w-50">
                :من عمر
              </label>
              <input
                type="number"
                id="from_age"
                value={filterParams.from_age}
                onChange={handleFilterChange}
                className="w-100 rounded p-1"
              />
              <label htmlFor="to_age" className="d-block w-50 mx-1">
                :الى عمر
              </label>
              <input
                type="number"
                id="to_age"
                value={filterParams.to_age}
                onChange={handleFilterChange}
                className="w-100 rounded p-1"
              />

              <Button
                variant="outlined"
                sx={{ mr: "10px" }}
                onClick={() => {
                  setSelectedFilters({
                    ...selectedFilters,
                    age: false,
                  });
                  setFilterParams({
                    ...filterParams,
                    from_age: "",
                    to_age: "",
                  });
                }}
              >
                الغاء
              </Button>
            </div>
          )}

          {selectedFilters.rate && (
            <div className="d-flex flex-row-reverse justify-content-between align-items-center mt-2">
              <label htmlFor="" className="d-block w-25 mx-1">
                :التقييم
              </label>
              <ReactStars
                count={3}
                onChange={(newRating) =>
                  setFilterParams({ ...filterParams, rate: newRating })
                }
                size={25}
                activeColor="#ffd700"
                value={filterParams.rate}
              />
              <Button
                variant="outlined"
                sx={{ mr: "10px" }}
                onClick={() => {
                  setSelectedFilters({
                    ...selectedFilters,
                    rate: false,
                  });
                  setFilterParams({
                    ...filterParams,
                    rate: "",
                  });
                }}
              >
                الغاء
              </Button>
            </div>
          )}
          {selectedFilters.gender && (
            <div className="d-flex flex-row-reverse justify-content-between align-items-center mt-2">
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                }}
              >
                <label htmlFor="gender" className="">
                  :اختر الجنس
                </label>
                <div
                  className="form-check mx-3"
                  style={{ display: "inline-block" }}
                >
                  <label className="form-check-label" htmlFor="male">
                    ذكر
                  </label>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    checked={filterParams.gender === "male"}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        gender: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-check" style={{ display: "inline-block" }}>
                  <label className="form-check-label" htmlFor="female">
                    انثى
                  </label>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    checked={filterParams.gender === "female"}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        gender: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                variant="outlined"
                sx={{ mr: "10px", alignSelf: "flex-end" }}
                onClick={() => {
                  setSelectedFilters({
                    ...selectedFilters,
                    gender: false,
                  });
                  setFilterParams({
                    ...filterParams,
                    gender: "",
                  });
                }}
              >
                الغاء
              </Button>
            </div>
          )}
        </Col>
        {/* Validation error message */}
        {validationError && (
          <div style={{ color: "red" }}>{validationError}</div>
        )}
      </Row>
      <div className="table-responsive table_container">
        <table className="table" dir="rtl">
          <thead>
            <tr>
              <th className="col"> اسم الزبون </th>
              <th className="col">الملاحظة </th>
              <th className="col">العمر </th>
              <th className="col">الجنس </th>
              <th className="col">التقييم </th>
            </tr>
          </thead>
          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="5">
                  <div className="my-4 text-center">
                    <p className="mb-2">جار التحميل</p>
                    <Spinner
                      className="m-auto"
                      animation="border"
                      role="status"
                    ></Spinner>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : isError ? (
            <tbody>
              <tr>
                <td colSpan="5">
                  <div className="my-5 text-center">
                    <p>{getErrorMessage(error)}</p>
                    {/* <button onClick={refetch}>Retry</button> */}
                    <RefreshButton handleClick={refetch}/>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {rates && rates.data && rates.data.length > 0 ? (
                rates.data.map((rest) => (
                  <tr key={rest.id}>
                    <td style={{ textAlign: "center" }}>{rest.name}</td>
                    <td style={{ textAlign: "center" }}>{rest.note}</td>
                    <td style={{ textAlign: "center" }}>{rest.birthday}</td>
                    <td style={{ textAlign: "center" }}>{rest.gender}</td>
                    <td style={{ textAlign: "center" }}>{rest.rate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <p className="my-5">لا توجد بيانات</p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {rates?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={rates?.meta?.total_pages} />
      )}
    </div>
  );
};

export default RatesRestContainer;
