import { Box, Chip, Typography, useMediaQuery } from "@mui/material";
import { Modal } from "react-bootstrap";

const ShowAdmin = ({ show, handleClose,data }) => {
  const styleChip = {
    "& .MuiChip-label": {
      fontSize: "14px",
      padding: "0px",
      minWidth: "100px",
      textAlign: "center",
    },
  };
  const styleBox = {
    border: "1px solid #000",
    borderRadius: "8px",
    padding: "10px",
  };
  if(!data) return null
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>التفاصيل</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Box
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          // m={"20px"}
          gap={4}
        >
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          flexWrap={"wrap"}
          >
            <Box display={"flex"} alignItems={"center"} gap={"10px"} sx={styleBox}>
              <Typography variant="h6">User Name: </Typography>
              <p>{data.user_name}</p>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={"10px"}
              sx={styleBox}
            >
              <Typography variant="h6">Name: </Typography>
              <p>{data.name}</p>
            </Box>
          </Box>
          <Box
            width={"100%"}
            display={"flex"}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Box display="flex"  justifyContent={"center"}
              alignItems={"center"} gap={1} sx={styleBox}
            >
              <Typography variant="h6">Role:</Typography>
              <p>{data?.roles}</p>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={"10px"} sx={styleBox}>
              <Typography variant="h6">Active:</Typography>
              <p>{data.is_active ? "Yes" : "No"}</p>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={"10px"} sx={styleBox}>
              <Typography variant="h6">Type:</Typography>
              <p>{data.type || "..."}</p>
            </Box>
          </Box>

          <Box
            display="flex"
            flexWrap={"wrap"}
            justifyContent={"center"}
            gap={1}
            // sx={styleBox}
          >
            <Typography variant="h6" >Permissions:</Typography>

            {data?.permissions?.map((permission, index) => (
              <Chip
                key={index}
                label={permission?.name}
                variant="outlined"
                color="primary"
                sx={styleChip}
              />
            ))}
          </Box>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default ShowAdmin;
