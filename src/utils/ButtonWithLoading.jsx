import { Fragment } from "react";
import { Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

const ButtonWithLoading = ({loading, text, style, handleClick}) => {

  const combinedStyle = {
    ...style,
    '&:hover': {
      backgroundColor: style?.background,
    },
  };
  return (
    <Fragment>
      {loading === true ? (
        <LoadingButton
          loading
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          sx={combinedStyle}
          // size="large"
        >
        {text}
        </LoadingButton>
      ) : (
        <Button
          variant="contained"
          type="submit"
          className=""
          sx={combinedStyle}
          onClick={handleClick}
          // size="large"
        >
          {text}
        </Button>
      )}
    </Fragment>
  );
};

export default ButtonWithLoading;
