// This component displays a modal with detailed invoice and order information
// related to a delivery driver's invoice, including summary, order breakdown, and additional charges.

import React from 'react';
import { ListGroup, Modal, Table } from 'react-bootstrap';
import {
  FaBuilding,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaTools
} from 'react-icons/fa';

/**
 * @component InvoiceOrderModal
 * 
 * @param {Object} props
 * @param {Object|boolean} props.show - If truthy, the modal is shown and holds invoice data.
 * @param {Function} props.handleClose - Callback to close the modal.
 * 
 * @returns {JSX.Element} Modal displaying invoice details.
 */
const InvoiceOrderModal = ({ show, handleClose }) => {
  return (
    <Modal 
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      style={{ direction: 'rtl' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>تفاصيل الفاتورة</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Invoice Summary */}
        <h5>ملخص الفاتورة</h5>
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td>رقم الفاتورة</td>
              <td>{show?.num}</td>
            </tr>
            <tr>
              <td>تاريخ الإنشاء</td>
              <td>{show?.created_at}</td>
            </tr>
          </tbody>
        </Table>

        {/* Orders Breakdown */}
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

        {/* Additional Charges */}
        <h5 className="mt-4">معلومات إضافية</h5>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <FaMoneyBillAlt className="me-2" />
            <strong>المجموع:</strong> {show?.price}
          </ListGroup.Item>

          {show?.consumer_spending && (
            <ListGroup.Item>
              <FaMoneyBillWave className="me-2" />
              <strong>الإنفاق الاستهلاكي:</strong> {show.consumer_spending}
            </ListGroup.Item>
          )}

          {show?.local_administration && (
            <ListGroup.Item>
              <FaBuilding className="me-2" />
              <strong>الإدارة المحلية:</strong> {show.local_administration}
            </ListGroup.Item>
          )}

          {show?.reconstruction && (
            <ListGroup.Item>
              <FaTools className="me-2" />
              <strong>إعادة الإعمار:</strong> {show.reconstruction}
            </ListGroup.Item>
          )}

          {show?.reconstruction && (
            <ListGroup.Item>
              <FaReceipt className="me-2" />
              <strong>الإجمالي:</strong> {show.total}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceOrderModal;
