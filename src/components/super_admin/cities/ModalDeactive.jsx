import { Modal, Button } from "react-bootstrap";

const ModalDeactive = ({
  show,
  handleClose,
  loading,
  error,
  handleDeactive,
  isActive
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      style={{ direction: "rtl" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{isActive? 'تأكيد عملية الغاء التنشيط':'تأكيد عملية التنشيط'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        هل أنت متأكد من هذه العملية
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          تجاهل
        </Button>
        {loading ? (
          <Button variant="danger" onClick={handleDeactive} disabled>
            حفظ
          </Button>
        ) : (
          <Button variant="danger" onClick={handleDeactive}>
            حفظ
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeactive;
