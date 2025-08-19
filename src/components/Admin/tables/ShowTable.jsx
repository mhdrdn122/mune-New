import { Box, IconButton, useMediaQuery } from "@mui/material";
import { Modal } from "react-bootstrap";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { FaShareAlt } from "react-icons/fa";

const ShowTable = ({ show, handleClose,table }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");
  return (
    <Modal show={show} onHide={handleClose} centered size="">
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>{table.number_table}</Modal.Title>
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
            src={table.qr_code}
            alt="click"
            width="100%"
            // height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          />
          <IconButton >
            <a 
              style={{color:'#111',fontSize:'50px'}}
              href={table.qr_code} download={table.qr_code}
            >
              <DownloadForOfflineIcon fontSize="190px" />  
            </a>
          </IconButton>
          
           {/* Share Button */}
           <IconButton
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Share QR Code",
                      text: "Check out this QR code!",
                      url: table?.qr_code, // QR image URL
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
            <FaShareAlt 
              style={{ fontSize: "30px", color: "#000" }} 
            />
          </IconButton>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default ShowTable;
