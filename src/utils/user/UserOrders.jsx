import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import LoginUserModal from "./LoginUserModal";
import { AdminContext } from "../../context/AdminProvider";
import NavBarUser from "./NavBarUser";
import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { ToastContainer } from "react-toastify";
import notify from "../useNotification";
import ModalDelete from "../../components/super_admin/cities/ModalDelete";
import ShowOrderModal from "./ShowOrderModal";
import InvoiceCurrentCard from "./InvoiceCurrentCard";
import OrderHistory from "./OrderHistory";
import DynamicSkeleton from "../DynamicSkeletonProps";

const UserOrders = () => {
  const { userToken } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { adminDetails } = useContext(AdminContext);
  const [invoices, setInvoices] = useState([]);
  const [selectedTab, setSelectedTab] = useState("current"); // "current" or "orders"
  const [showDelete, setShowDelete] = useState(false);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);







  const handleShowDelete = (id) => {
    setShowDelete(id);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleDelete = async () => {
    setDeleteOrderLoading(true);
    try {
      const result = await axios.delete(
        `${baseURLLocalPublic}/user_api/delete_order?id=${showDelete}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (result.status === true) {
        notify(result.message, "success");
        handleCloseDelete();
        getOrders();
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      console.error("Failed:", error);
      notify(error?.data?.message, "error");
    } finally {
      setDeleteOrderLoading(false);
      handleCloseDelete();
      getOrders();
    }
  };

  const handleShowOrder = (e) => {
    setShowOrderModal(e);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
  };

  const getOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${baseURLLocalPublic}/user_api/show_orders?type=${selectedTab}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setInvoices(response?.data?.data);
      setLoading(false)
    } catch (error) {
      console.log("error of received Orders info : ", error);
      setLoading(false)
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    setShowLoginModal(!userToken);
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      getOrders();
    }
  }, [selectedTab, userToken]);

  const getTabStyle = (type) => {
    const color = adminDetails?.color?.substring(10, 16)
      ? `#${adminDetails.color.substring(10, 16)}`
      : "black";
    return {
      color: selectedTab === type ? color : "black",
      fontWeight: selectedTab === type ? "bold" : "",
      borderBottom: selectedTab === type ? `1px solid ${color}` : "",
      cursor: "pointer",
    };
  };



  return (
    <div className=" ">
      <NavBarUser />
      <div
        className="py-10 px-2 md:h-auto "
        style={{
          minHeight: "calc(100vh + 124px)",
          width: "100%",
          ...(adminDetails?.background_image_category &&
            adminDetails?.image_or_color
            ? {
              backgroundImage: `url(${adminDetails?.background_image_category})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
            : {
              backgroundColor: `#${adminDetails?.background_color?.substring(
                10,
                16
              )}`,
            }),
        }}
      >
        {userToken ? (
          <div className="w-full  m-auto pt-5">
            {/* Navigation Bar for Tabs */}
            <div
              className="d-flex justify-content-center m-auto p-2 bg-light rounded-full gap-4"
              style={{ maxWidth: "500px" }}
            >
              {["current", "orders"].map((type) => (
                <p
                  key={type}
                  style={getTabStyle(type)}
                  onClick={() => setSelectedTab(type)}
                  className="flex-1 text-center "
                >
                  {type === "current" ? "الطلبات الحالية" : "طلباتي"}
                </p>
              ))}
            </div>

            {/* Conditionally Render Section Based on selectedTab */}
            {loading ?
              ((
                <div className="my-5">

                  <DynamicSkeleton
                    count={10}
                    variant="rounded"
                    height={250}
                    animation="wave"
                    spacing={3}
                    columns={{ xs: 12, sm: 6, md: 3 }}

                  />
                </div>
              ))
              :
              (
                <div className="mt-3 w-full    ">
                  {selectedTab === "current" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {invoices?.map((e, i) => {
                        return (
                          <InvoiceCurrentCard
                            e={e}
                            i={i}
                            adminDetails={adminDetails}
                            handleShowDelete={handleShowDelete}
                            handleShowOrder={handleShowOrder}
                          />
                        );
                      })}
                    </div>
                  ) : selectedTab === "orders" ? (
                    <div className="grid grid-cols-1 sx:grid-cols-3 lg:grid-cols-4 gap-2">
                      {invoices?.map((e, i) => (
                        <OrderHistory e={e} i={i} handleShowOrder={handleShowOrder} adminDetails={adminDetails} />
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            }

          </div>
        ) : (
          <LoginUserModal
            show={showLoginModal}
            handleClose={handleCloseModal}
          />
        )}
      </div>
      <ModalDelete
        show={showDelete}
        handleClose={handleCloseDelete}
        loading={deleteOrderLoading}
        handleDelete={handleDelete}
      />
      <ToastContainer />
      <ShowOrderModal
        show={showOrderModal}
        handleClose={handleCloseOrderModal}
      />
    </div>
  );
};

export default UserOrders;
