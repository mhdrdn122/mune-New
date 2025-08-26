// This modal displays detailed information for a selected delivery driver.

import React from 'react';
import { Modal } from "react-bootstrap";
import { useShowOneDeliveryQuery } from '../../../redux/slice/deliveries/deliveriesApi';

const ShowDeliveriesModal = ({ show, handleClose, id }) => {
  // Fetch individual delivery driver data using the ID
  const {
    data: user,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useShowOneDeliveryQuery(id, {
    skip: !show, // Skip API call if modal is not shown
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>تفاصيل السائق</Modal.Title>
      </Modal.Header>

      <Modal.Body className="d-flex justify-content-center">
        {/* Loading state */}
        {isFetching ? (
          <p>جار التحميل...</p>
        ) : isError ? (
          <p>{error?.data?.message || "حدث خطأ"}</p>
        ) : (
          // Driver information display
          <div className="d-flex flex-column justify-content-center align-items-center w-50">
            <img
              src={user?.data?.image}
              className="w-[300px] h-[400px]"
              alt="Driver"
            />
            <p className="d-flex justify-content-between w-100 fw-bold">
              {user?.data?.name || "..."} <span>: الاسم</span>
            </p>
            <p className="d-flex justify-content-between w-100 fw-bold">
              {user?.data?.phone || "..."} <span>: رقم الموبايل</span>
            </p>
            <p className="d-flex justify-content-between w-100 fw-bold">
              {user?.data?.address || "..."} <span>: العنوان</span>
            </p>
            <p className="d-flex justify-content-between w-100 fw-bold">
              {user?.data?.birthday || "..."} <span>: عيد الميلاد</span>
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ShowDeliveriesModal;
