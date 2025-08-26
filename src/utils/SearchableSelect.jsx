/* eslint-disable react/prop-types */
import { DisabledByDefault } from "@mui/icons-material";
import {
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
  MenuItem,
  styled,
} from "@mui/material";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1), 
}));

const SearchableSelect = ({
  label,
  options = [],
  formik,
  name,
  margin,
  size,
  getOptionLabel = (option) => option.name || "", // Default option label handler
}) => {
  // console.log(margin);
  return (
    <FormControl
      variant="outlined"
      fullWidth
      // margin={margin === undefined ? "dense" : margin}
      // margin="dense"
      error={!!formik.touched[name] && !!formik.errors[name]}
    >
      <Autocomplete
        id={name}
        size={"small"}
        // options={options}
        options={[{ id: "", name: "No Select"}, ...options]}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value) => {
          formik.setFieldValue(name, value ? value.id : ""); // Set value in Formik
        }}
        onBlur={formik.handleBlur} // Handle blur
        value={options.find((item) => item.id === formik.values[name]) || null} // Set current value
        renderOption={(props, option) => (
          <StyledMenuItem {...props} key={option.id} disabled={option.id === ""}>
            {getOptionLabel(option)}
          </StyledMenuItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            error={!!formik.touched[name] && !!formik.errors[name]}
          />
        )}
      />
      {formik.touched[name] && formik.errors[name] && (
        <FormHelperText>{formik.errors[name]}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SearchableSelect;
