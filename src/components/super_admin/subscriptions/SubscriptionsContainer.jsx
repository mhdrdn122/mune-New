import { Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AddSubscription from "./AddSubscription";
import { useGetSubscriptionsQuery } from "../../../redux/slice/super_admin/resturant/resturantsApi";
import useError401 from "../../../hooks/useError401 ";
import { useState } from "react";
import Pagination from "../../../utils/Pagination";

const SubscriptionsContainer = ({ show, handleClose, randomNumber }) => {
  const navigate = useNavigate();
  const { cityId, resId } = useParams();
  const [page, setPage] = useState(1)
  const {
    data: subscriptions,
    isError,
    error,
    isLoading: loading,
    isFetching
  } = useGetSubscriptionsQuery({ page, resId, randomNumber });
  const { triggerRedirect } = useError401(isError, error);
  // console.log(subscriptions.data.package)

  const onPress =  (page) => {
    setPage(page);
  };

  return (
    <div>
      <div className="table-responsive table_container">
        <table className="table" dir="rtl">
          <thead>
            <tr>
              <th className="col"> الاسم </th>
              <th className="col"> عدد الايام </th>
              <th className="col"> السعر </th>
            </tr>
          </thead>
          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="4">
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
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan="4">
                  <p className="my-5">{error.message}</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {subscriptions &&
              subscriptions.data &&
              subscriptions.data.package &&
              subscriptions.data.package.length > 0 ? (
                subscriptions.data.package.map((admin, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: "center" }}>{admin.title}</td>
                    <td style={{ textAlign: "center" }}>{admin.value}</td>
                    <td style={{ textAlign: "center" }}>{admin.price}</td>
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

      {subscriptions?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={subscriptions?.meta?.total_pages} />
      )}

      <AddSubscription show={show} handleClose={handleClose} />

      <ToastContainer />
    </div>
  );
};

export default SubscriptionsContainer;
