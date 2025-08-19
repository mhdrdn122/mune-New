import { Box, IconButton, useMediaQuery } from "@mui/material";
import { Modal } from "react-bootstrap";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { FaShareAlt } from "react-icons/fa";

/**
 * `ShowTable` modal displays a table's QR code, with options to download or share it.
 *
 * @param {boolean} show - Controls the visibility of the modal
 * @param {Function} handleClose - Function to close the modal
 * @param {Object} table - The table object containing details (number and QR code)
 * @returns {JSX.Element|null}
 */
const ShowTable = ({ show, handleClose, table }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");

  if (!table) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>{table?.number_table}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Box
          display="flex"
          flexDirection={isSmallDevice ? "column" : "row"}
          justifyContent="center"
          alignItems="center"
          m="20px"
          gap={4}
        >
          <img
            src={table?.qr_code}
            alt="QR Code"
            width="100%"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          />

          {/* Download QR Code */}
          <IconButton>
            <a
              style={{ color: "#111", fontSize: "50px" }}
              href={table?.qr_code}
              download={`table-${table?.number_table}-qr-code.png`}
            >
              <DownloadForOfflineIcon fontSize="large" />
            </a>
          </IconButton>

          {/* Share QR Code */}
          <IconButton
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "Share QR Code",
                    text: "Check out this QR code!",
                    url: table?.qr_code,
                  });
                  console.log("QR code shared successfully!");
                } catch (error) {
                  console.error("Error sharing QR code:", error.message);
                }
              } else {
                alert("Web Share API is not supported in your browser.");
              }
            }}
          >
            <FaShareAlt style={{ fontSize: "30px", color: "#000" }} />
          </IconButton>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default ShowTable;
