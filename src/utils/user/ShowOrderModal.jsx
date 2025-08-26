import React from 'react'
// import { Modal, Table } from 'react-bootstrap'
import { ListGroup, Modal, Table } from 'react-bootstrap'
import { FaBuilding, FaMoneyBillAlt, FaMoneyBillWave, FaMotorcycle, FaReceipt, FaTools } from 'react-icons/fa'
import { TbDiscount } from 'react-icons/tb'

const ShowOrderModal = ({show,handleClose}) => {
  return (
    <Modal 
    show={show}
    onHide={handleClose}
    centered
    style={{ direction: "rtl" }}
    size="lg" // Makes the modal bigger for larger content
      >
       <Modal.Header>
        <Modal.Title>تفاصيل الفاتورة</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Invoice Summary */}
        <h5>ملخص الفاتورة</h5>
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td>رقم الفاتورة</td>
              <td>{show.num}</td>
            </tr>

            <tr>
              <td>تاريخ الإنشاء</td>
              <td>{show.created_at}</td>
            </tr>
          </tbody>
        </Table>

        {/* Orders List */}
        <h5>تفاصيل الطلبات</h5>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>السعر</th>
              <th>العدد</th>
              <th>المجموع</th>

            </tr>
          </thead>
          <tbody>
            {show?.orders?.map((order) => (
              <tr key={order.id}>
                <td>{order.name}</td>
                <td>{order.price}</td>
                <td>{order.count}</td>
                <td>{order.total}</td>

              </tr>
            ))}
          </tbody>
        </Table>
        <h5 className="mt-4">معلومات إضافية</h5>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <FaMoneyBillAlt className="me-2" /> <strong>المجموع:</strong>{" "}
            {show.price} 
          </ListGroup.Item>

          {   show.delivery_price &&
            <ListGroup.Item>
            <FaMotorcycle  className="me-2" />{" "}
            <strong>أجرة التوصيل :</strong> {show.delivery_price}
          </ListGroup.Item>
        }
         {   show.discount &&
            <ListGroup.Item>
            <TbDiscount  className="me-2" />{" "}
            <strong>قيمة الحسم  :</strong> {show.discount}
          </ListGroup.Item>
        }

        {
          show.total_with_delivery_price &&         
            <ListGroup.Item>
              <FaReceipt className="me-2" /> <strong>الإجمالي:</strong>{" "}
              {show.total_with_delivery_price
              } {/* Total invoice */}
            </ListGroup.Item> 
        }
        </ListGroup>
      </Modal.Body>
    </Modal>
        )
}

export default ShowOrderModal