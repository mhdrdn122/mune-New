import { Button, Modal, Spinner } from 'react-bootstrap'

const AttentionModal = ({message,title,onIgnore,onOk,show,handleClose,loading}) => {
  return (
    <Modal show={show} onHide={handleClose} centered style={{ direction: 'rtl' }}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onIgnore}>
                تجاهل
            </Button>
            <Button variant="danger" onClick={onOk}>
                {
                    loading ? <Spinner size='sm'/> : "حفظ"
                }
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default AttentionModal
