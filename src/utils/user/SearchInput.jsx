import { Form, Modal, ModalBody } from "react-bootstrap";

const SearchInput = ({
  showModal,
  handleClose,
  searchWord,
  setSearchWord,
  language,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} className="searchModal p-0 ">
      <ModalBody className="p-0">
        <Form className="" onSubmit={(e) => e.preventDefault()}>
          <input
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            type=""
            placeholder={language === "en" ? "Search..." : "...ابحث"}
            className="form-search"
            style={{ textAlign: language === "en" ? "" : "right" }}
          />
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default SearchInput;
