import { Modal, Button } from "react-bootstrap";

const ModalDelete = ({ show, handleClose, loading, error, handleDelete ,isLoading}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      style={{ direction: "rtl" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>تأكيد عملية الحذف</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        هل انت متاكد من حذف هذا العنصر ؟
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          تجاهل
        </Button>
        {loading ? (
          <Button variant="danger" onClick={handleDelete} disabled>
            حفظ
          </Button>
        ) : (
          <Button variant="danger" onClick={handleDelete}>
            حفظ
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelete;
