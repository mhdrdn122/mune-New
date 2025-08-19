import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import LoginUserModal from "./LoginUserModal";
import {
  FaCheckCircle,
  FaEye,
  FaHome,
  FaMotorcycle,
  FaStore,
} from "react-icons/fa";
import { AdminContext } from "../../context/AdminProvider";
import NavBarUser from "./NavBarUser";
import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { ToastContainer } from "react-toastify";
import notify from "../useNotification";
import ModalDelete from "../../components/super_admin/cities/ModalDelete";
import ShowOrderModal from "./ShowOrderModal";
import { IconButton } from "@mui/material";

const UserOrders = () => {
  const { userToken } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { adminDetails } = useContext(AdminContext);
  const [invoices, setInvoices] = useState([]);
  const [selectedTab, setSelectedTab] = useState("current"); // "current" or "orders"
  const [showDelete, setShowDelete] = useState(false);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

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
    } catch (error) {
      console.log("error of received Orders info : ", error);
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

  // Show loading state while data is being fetched
  if (!invoices) {
    return (
      <div className="flex justify-center w-full">
        <span className="loader">Loading...</span>
      </div>
    );
  }

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
            <div className="mt-3 w-full    ">
              {selectedTab === "current"
                ?   ( <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {invoices?.map((e, i) => (
                    <div
                      key={i}
                      className="container p-4 bg-white rounded shadow-sm mt-3"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-secondary fw-bold">
                          #{e?.num}
                        </span>
                        <span
                          style={{
                            color: `#${adminDetails?.color?.substring(10, 16)}`,
                          }}
                          className="fw-bold"
                        >
                          {e?.region}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          disabled={[
                            "Under delivery",
                            "paid",
                            "processing",
                          ].includes(e.status)}
                          onClick={() => handleShowDelete(e.id)}
                          className="btn btn-danger btn-sm"
                        >
                          حذف الطلب
                        </button>
                        <h5 className="text-dark fw-bold">
                          <IconButton onClick={() => handleShowOrder(e)}>
                            <FaEye size={25} />
                          </IconButton>
                        </h5>
                      </div>

                      {/* Progress Bar */}
                      <div className="d-flex align-items-center justify-content-between mt-4">
                        <div className="text-center">
                          <FaHome
                            color={
                              e.status === "paid"
                                ? `#${adminDetails?.color?.substring(10, 16)}`
                                : ""
                            }
                            className="fs-4"
                          />
                        </div>
                        <div
                          className="flex-grow-1 mx-2 bg-secondary"
                          style={{ height: "2px" }}
                        ></div>

                        <div className="text-center">
                          <FaMotorcycle
                            color={
                              ["Under delivery", "paid"].includes(e.status)
                                ? `#${adminDetails?.color?.substring(10, 16)}`
                                : ""
                            }
                            className="fs-4"
                          />
                        </div>
                        <div
                          className="flex-grow-1 mx-2 bg-secondary"
                          style={{ height: "2px" }}
                        ></div>

                        <div className="text-center">
                          <FaStore
                            color={
                              ["processing", "Under delivery", "paid"].includes(
                                e.status
                              )
                                ? `#${adminDetails?.color?.substring(10, 16)}`
                                : ""
                            }
                            className="fs-4"
                          />
                        </div>
                        <div
                          className="flex-grow-1 mx-2 bg-secondary"
                          style={{ height: "2px" }}
                        ></div>

                        <div className="text-center">
                          <FaCheckCircle
                            color={
                              [
                                "approved",
                                "processing",
                                "Under delivery",
                                "paid",
                              ].includes(e.status)
                                ? `#${adminDetails?.color?.substring(10, 16)}`
                                : e.status === "rejected"
                                ? "#BB2D3B"
                                : ""
                            }
                            className="fs-4"
                          />
                        </div>
                      </div>

                      <p className="text-muted text-center mt-3">
                        {e.status === "approved" && (
                          <>لقد تم الموافقة على طلبك</>
                        )}
                        {e.status === "processing" && <>طلبك قيد التحضير</>}
                        {e.status === "Under delivery" && <>طلبك قيد التوصيل</>}
                        {e.status === "paid" && <>لقد تم توصيل الطلب</>}
                        {e.status === "rejected" && <>لقد تم رفض الطلب </>}
                        {![
                          "approved",
                          "processing",
                          "Under delivery",
                          "paid",
                          "rejected",
                        ].includes(e.status) && <>طلبك قيد الانتظار </>}
                      </p>
                    </div>
                  ))}
                </div>  )
                : selectedTab === "orders"
                ?(<div className="grid grid-cols-1 sx:grid-cols-3 lg:grid-cols-4 gap-2">
                     {invoices?.map((e, i) => (
                    <div key={i} className="d-flex justify-content-center my-4">
                      <div
                        style={{
                          width: "350px",
                          height: "250px",
                          backgroundColor: "white",
                          borderRadius: "20px",
                          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 4px",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "end",
                            display: "flex",
                            flexDirection: "column",
                            padding: "15px",
                            fontSize: "1.2em",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "0",
                              top: "0",
                              padding: "5px",
                              // borderRadius: "20px 0 20px 0",
                              // border: `2px solid #${adminDetails?.color?.substring(10, 16)}`,
                            }}
                          >
                            <IconButton onClick={() => handleShowOrder(e)}>
                              <FaEye
                                color={`#${adminDetails?.color?.substring(
                                  10,
                                  16
                                )}`}
                                size={25}
                              />
                            </IconButton>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                            className="mt-3"
                          >
                            <p
                              style={{
                                color: `#${adminDetails?.color?.substring(
                                  10,
                                  16
                                )}`,
                              }}
                            >
                              {e?.num}{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: `#${adminDetails?.color?.substring(
                                    10,
                                    16
                                  )}`,
                                }}
                              >
                                : رقم الفاتورة
                              </span>
                            </p>
                            <p style={{ color: "#6c757d" }}>
                              {e?.created_at}{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: `#${adminDetails?.color?.substring(
                                    10,
                                    16
                                  )}`,
                                }}
                              >
                                : تاريخ الطلب
                              </span>
                            </p>
                            <p>
                              <span>s.p {e?.delivery_price}</span>{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: `#${adminDetails?.color?.substring(
                                    10,
                                    16
                                  )}`,
                                }}
                              >
                                : أجرة التوصيل
                              </span>
                            </p>
                            <hr />
                          </div>
                          <p>
                            <span>s.p {e?.total} </span>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: `#${adminDetails?.color?.substring(
                                  10,
                                  16
                                )}`,
                              }}
                            >
                              : المجموع الكلي
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>)
                : null}
            </div>
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
