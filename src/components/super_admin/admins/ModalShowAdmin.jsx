import { Padding } from "@mui/icons-material";
import { Box, Chip, Typography, useMediaQuery } from "@mui/material";
import { Modal } from "react-bootstrap";

const ModalShowAdmin = ({ show, handleClose }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");

  // const styleChip = {
  //   "& .MuiChip-root.MuiChip-outlined": {
  //     padding: "14px",
  //   },
  //   "& .MuiChip-label": {
  //     fontSize: "14px",
  //     padding: "0px",
  //   },
  // };

  const styleChip = {
    "& .MuiChip-label": {
      fontSize: "14px",
      padding: "0px",
      minWidth: "100px",
      textAlign: "center",
    },
  };
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
            gap={"50px"}
          >
            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Typography variant="h6">User Name: </Typography>
              <p>{show.user_name}</p>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Typography variant="h6">Name: </Typography>
              <p>{show.name}</p>
            </Box>
          </Box>
          
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"50px"}
          >
            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Typography variant="h6">City: </Typography>
              <p>{show?.city?.name}</p>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
              <Typography variant="h6">Active:</Typography>
              <p>{show.is_active ? "Yes" : "No"}</p>
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            <Typography variant="h6">Roles:</Typography>

            <Chip
              label={show?.roles}
              color="primary"
              variant="outlined"
              sx={styleChip}
            />
          </Box>

          <Box
            display="flex"
            flexWrap={"wrap"}
            justifyContent={"center"}
            gap={1}
          >
            <Typography variant="h6">Permissions:</Typography>

            {show?.permissions?.map((permission, index) => (
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

export default ModalShowAdmin;
