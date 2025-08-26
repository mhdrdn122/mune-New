import React from 'react'
import { ListGroup, Modal, Table } from 'react-bootstrap'
import { FaBuilding, FaMoneyBillAlt, FaMoneyBillWave, FaReceipt, FaTools } from 'react-icons/fa'

const InvoiceOrderModal = ({show,handleClose,invoice}) => {
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
            {invoice?.orders?.map((order) => (
              <tr key={order.id}>
                {/* <td>{order.id}</td> */}
                <td>{order.name}</td>
                {/* <td>{order.type_ar || order.type_en}</td> */}
                <td>{order.price}</td>
                <td>{order.count}</td>
                <td>{order.total}</td>

                {/* <td>{order.status}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Additional Information - New Style */}
        <h5 className="mt-4">معلومات إضافية</h5>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <FaMoneyBillAlt className="me-2" /> <strong>المجموع:</strong>{" "}
            {invoice?.price} 
          </ListGroup.Item>

        {   invoice?.consumer_spending &&
            <ListGroup.Item>
            <FaMoneyBillWave className="me-2" />{" "}
            <strong>الإنفاق الاستهلاكي:</strong> {invoice?.consumer_spending}
          </ListGroup.Item>
        }
        {
           invoice?.local_administration && 
              <ListGroup.Item>
              <FaBuilding className="me-2" /> <strong>الإدارة المحلية:</strong>{" "}
              {invoice?.local_administration}
            </ListGroup.Item>
        }
        {
           invoice?.reconstruction &&         
              <ListGroup.Item>
              <FaTools className="me-2" /> <strong>إعادة الإعمار:</strong>{" "}
              {invoice?.reconstruction}
            </ListGroup.Item>
        }  
        {
          invoice?.reconstruction &&         
            <ListGroup.Item>
              <FaReceipt className="me-2" /> <strong>الإجمالي:</strong>{" "}
              {invoice?.total} {/* Total invoice */}
            </ListGroup.Item> 
        }
        </ListGroup>
      </Modal.Body>
    </Modal>
)
}

export default InvoiceOrderModal