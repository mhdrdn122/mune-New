// import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
// import NavigateNextIcon from "@mui/icons-material/NavigatePrevious";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Breadcrumb = ({ breadcrumbs }) => {
  // eslint-disable-next-line react/prop-types
  const styledBreadcrumbs = breadcrumbs.map((breadcrumb, index) => {
    return breadcrumb.to ? (
      <Link to={breadcrumb.to}  key={index}>
        <Chip label={breadcrumb.label} clickable />
      </Link>
    ) : (
      <Chip key={index} label={breadcrumb.label} deleteIcon={breadcrumb.icon} />
    );
  });

  return (
    <Stack spacing={2} direction={"row-reverse"}>
      <Breadcrumbs
        separator={<NavigateBeforeIcon fontSize="small" />}
        aria-label="breadcrumb"
        // justifyContent={'flex-end'}
        // sx={{display: 'flex', justifyContent: 'flex-end'}}
      >
        {styledBreadcrumbs}
        {
          // <Link to={"/"}>
          //   <Chip
          //     label={"الرئيسية"}
          //     onDelete={(e) => e.preventDefault()}
          //     deleteIcon={<HomeIcon />}
          //     clickable
          //   />
          // </Link>
        }
      </Breadcrumbs>
    </Stack>
  );
};

export default Breadcrumb;
