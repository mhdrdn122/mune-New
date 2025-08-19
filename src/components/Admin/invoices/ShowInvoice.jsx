import { useRef } from "react";
import html2canvas from "html2canvas";
import {
  Modal,
  Button,
  Spinner,
  Table,
  ListGroup,
} from "react-bootstrap";
import { useGetOneInvoicesQuery } from "../../../redux/slice/order/orderApi";
import {
  FaBuilding,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaTools,
} from "react-icons/fa";
import { FaMotorcycle } from "react-icons/fa6";

const ShowInvoice = ({ show, handleClose,id }) => {
  const printRef = useRef(null);

  const {
    data: invoiceData,
    isError,
    error,
    isLoading,
    isFetching,
  } = useGetOneInvoicesQuery({ id: id }, { skip: !show });

  // Handle invoice download as image
  const handleDownloadImage = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `invoice_${invoiceData?.data?.invoice?.num}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || isFetching) {
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
          <p className="text-danger">Error: {error.data.message}</p>
        </Modal.Body>
      </Modal>
    );
  }

  if (!invoiceData) return null;

  const { invoice, orders } = invoiceData.data;

  return (
    <Modal show={show} onHide={handleClose} centered style={{ direction: "rtl" }} size="lg">
      <Modal.Header>
        <Modal.Title>تفاصيل الفاتورة</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={printRef}> {/* Reference for image capture */}
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
            {invoice?.orders.map((order) => (
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
            <FaMoneyBillAlt className="me-2" /> <strong>المجموع:</strong> {invoice.price}
          </ListGroup.Item>
          {invoice.consumer_spending && (
            <ListGroup.Item>
              <FaMoneyBillWave className="me-2" /> <strong>الإنفاق الاستهلاكي:</strong> {invoice.consumer_spending}
            </ListGroup.Item>
          )}
          {invoice.local_administration && (
            <ListGroup.Item>
              <FaBuilding className="me-2" /> <strong>الإدارة المحلية:</strong> {invoice.local_administration}
            </ListGroup.Item>
          )}
          {invoice.reconstruction && (
            <ListGroup.Item>
              <FaTools className="me-2" /> <strong>إعادة الإعمار:</strong> {invoice.reconstruction}
            </ListGroup.Item>
          )}
           {invoice.delivery_price && (
            <ListGroup.Item>
              <FaMotorcycle className="me-2" /> <strong>أجرة التوصيل:</strong> {invoice.delivery_price}
            </ListGroup.Item>
          )}
          {invoice.total && (
            <ListGroup.Item>
              <FaReceipt className="me-2" /> <strong>الإجمالي:</strong> {invoice.total}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDownloadImage}>
          تحميل الفاتورة كصورة
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowInvoice;
