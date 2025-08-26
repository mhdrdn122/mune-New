import { TextField, FormControl, InputLabel } from "@mui/material";

const DateFilter = ({ value, setValue, name, label }) => {
  return (
    <FormControl
      fullWidth
      // focused
      // size="small"
      // margin="dense"
      sx={{ mb: "20px", mr: "22px", bgcolor: "#FFF" }}
    >
      {/* <InputLabel htmlFor={name}>{label}</InputLabel> */}
      <TextField
        id={name}
        name={name}
        type='date'
        value={value}
        // defaultValue={nowDate}
        label={label}
        onChange={(e) => setValue(e.target.value)}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        size="small"
      />
    </FormControl>
  );
};

export default DateFilter;
