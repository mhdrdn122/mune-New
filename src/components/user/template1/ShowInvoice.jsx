import { useEffect } from "react";
import { Modal, Button, Spinner, Table, ListGroup } from "react-bootstrap";
import {
  FaBuilding,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaTools,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getOrdersInvoice } from "../../../redux/slice/user section/ordersSlice";
import { useSelector } from "react-redux";
import { FaMotorcycle } from "react-icons/fa6";
import { TbDiscount } from "react-icons/tb";

const ShowInvoice = ({ show, userToken, handleClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useEffect triggered, show:", show);

    const getOrders = async () => {
      await dispatch(getOrdersInvoice({ userToken }));
    };
    if (show) {
      getOrders();
    }
  }, [show, userToken]);

  const {
    loading: isLoading,
    error: isError,
    data: invoiceData,
  } = useSelector((state) => state.orders.ordersInvoice);

  // Loading and Error States
  if (isLoading) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="text-center my-5">
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="text-center my-5">
          <p className="text-danger">Error: {isError?.message}</p>
        </Modal.Body>
      </Modal>
    );
  }

  // If no data, just return early
  if (!invoiceData) return null;

  console.log(invoiceData);
  const { invoice, orders } = invoiceData?.data;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      style={{ direction: "rtl" }}
      size="lg"
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
              <td>{invoice.num}</td>
            </tr>
            <tr>
              <td>رقم الطاولة</td>
              <td>{invoice.number_table}</td>
            </tr>
            <tr>
              <td>تاريخ الإنشاء</td>
              <td>{invoice.created_at}</td>
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
            {orders.map((order) => (
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
            <FaMoneyBillAlt className="me-2" /> <strong>السعر :</strong>{" "}
            {invoice.price}
          </ListGroup.Item>
          {!localStorage.getItem("tableId") && (
            <ListGroup.Item>
              <FaMotorcycle className="me-2" /> <strong>سعر التوصيل:</strong>{" "}
              {invoice.delivery_price}
            </ListGroup.Item>
          )}
          {!localStorage.getItem("tableId") && (
            <ListGroup.Item>
              <TbDiscount className="me-2" /> <strong>قيمة الحسم:</strong>{" "}
              {invoice.discount}
            </ListGroup.Item>
          )}
          <ListGroup.Item>
            <FaMoneyBillAlt className="me-2" /> <strong>المجموع الكلي:</strong>{" "}
            {invoice.total_with_delivery_price}
          </ListGroup.Item>
          {invoice.consumer_spending && (
            <ListGroup.Item>
              <FaMoneyBillWave className="me-2" />{" "}
              <strong>الإنفاق الاستهلاكي:</strong> {invoice.consumer_spending}
            </ListGroup.Item>
          )}
          {invoice.local_administration && (
            <ListGroup.Item>
              <FaBuilding className="me-2" /> <strong>الإدارة المحلية:</strong>{" "}
              {invoice.local_administration}
            </ListGroup.Item>
          )}
          {invoice.reconstruction && (
            <ListGroup.Item>
              <FaTools className="me-2" /> <strong>إعادة الإعمار:</strong>{" "}
              {invoice.reconstruction}
            </ListGroup.Item>
          )}
          {invoice.reconstruction && (
            <ListGroup.Item>
              <FaReceipt className="me-2" /> <strong>الإجمالي:</strong>{" "}
              {invoice.total} {/* Total invoice */}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          variant="secondary"
          onClick={handleClose}
          className="bgColorLikeColorFullOpactiy"
        >
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowInvoice;
