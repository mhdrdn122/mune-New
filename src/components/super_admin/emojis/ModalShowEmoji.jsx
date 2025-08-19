import { Box, useMediaQuery } from "@mui/material";
import { Modal } from "react-bootstrap";

const ModalShowEmoji = ({ show,emoji, handleClose }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>{emoji?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Box
          display={"flex"}
          flexDirection={isSmallDevice ? "column" : "row"}
          justifyContent={"center"}
          alignItems={"center"}
          m={"20px"}
          gap={4}
        >
          <img
            src={emoji?.bad_image}
            alt="click"
            width="30%"
            height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          ></img>
          <img
            src={emoji?.good_image}
            alt="click"
            width="30%"
            height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          ></img>

          <img
            src={emoji?.perfect_image}
            alt="click"
            width="30%"
            height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          ></img>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default ModalShowEmoji;
