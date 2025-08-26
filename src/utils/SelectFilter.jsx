import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectFilter = ({ value, setValue, name, label, options }) => {
  const styleMenuItem = {
    padding: "7px !important",
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
      size="small"
      // margin="dense"
      sx={{ mb: "20px", mr: "22px", bgcolor: '#FFF' }}
    >
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        // InputLabelProps={{ shrink: true }}
        labelId={name}
        id={name}
        name={name}
        label={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      >
        <MenuItem value={""} dir="rtl" sx={styleMenuItem}>
          {"الكل"}
        </MenuItem>
        {options?.map((item) => (
          <MenuItem key={item.id} value={item.id} dir="rtl" sx={styleMenuItem}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
