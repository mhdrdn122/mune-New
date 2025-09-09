import React from 'react'
import { Modal } from "react-bootstrap";
import { useShowOneUserQuery } from "../../../redux/slice/users/usersApi";
const ShowUserModal = ({show,id, handleClose}) => {
      const {
          data: user,
          isError,
          error,
          isLoading: loading,
          isFetching,
        } = useShowOneUserQuery(id ,  {
          skip: !id, // Skip the API call if `show` is null or false
      });
       return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className='d-flex justify-content-center'>
                <Modal.Title >تفاصيل المستخدم</Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-center'>
                {isFetching ? (
                    <p>جار التحميل...</p>
                ) : isError ? (
                    <p>{error?.data?.message || "حدث خطأ"}</p>
                ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center w-50">
                        <p className="d-flex justify-content-between w-100 fw-bold">
                            {user?.data?.name || "..."}
                            <span> : الاسم  </span>
                        </p>
                        <p className="d-flex justify-content-between w-100 fw-bold">
                            {user?.data?.phone || "..."}<span> : رقم الموبايل </span>
                        </p>
                        <p className="d-flex justify-content-between w-100 fw-bold">
                            {user?.data?.address?.city || "..."}<span> : العنوان </span>
                        </p>
                        <p className="d-flex justify-content-between w-100 fw-bold">
                            {user?.data?.birthday || "..."}<span> : عيد الميلاد </span>
                        </p>
                    </div>

                )}
            </Modal.Body>
        </Modal>
      )
}

export default ShowUserModal