/**
 * File: Panorama.js
 * Description:
 *   - A reusable React component using MUI for selecting whether an advertisement is panoramic.
 *   - Connected to Formik for form state management and validation.
 */

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";

/**
 * Panorama Component
 *
 * @component
 * @param {Object} props
 * @param {Object} props.formik - Formik object containing form state, values, errors, and handlers.
 *
 * @returns {JSX.Element}
 */
const Panorama = ({ formik }) => {
  console.log('pannnn : ', formik); // For debugging

  return (
    <FormControl
      variant="outlined"
      fullWidth
      margin="dense"
      error={!!formik.touched.is_panorama && !!formik.errors.is_panorama}
    >
      <InputLabel id="menu_id">Panorama</InputLabel>

      <Select
        InputLabelProps={{ shrink: true }}
        labelId="is_panorama"
        id="is_panorama"
        name="is_panorama"
        label="Panorama"
        value={formik.values.is_panorama}
        onChange={formik.handleChange}
      >
        <MenuItem value={1} sx={{ padding: "7px !important" }}>
          Yes
        </MenuItem>
        <MenuItem value={0} sx={{ padding: "7px !important" }}>
          NO
        </MenuItem>
      </Select>

      {/* Show error message if field is touched and has error */}
      {formik.touched.is_panorama && formik.errors.is_panorama && (
        <FormHelperText>{formik.errors.is_panorama}</FormHelperText>
      )}
    </FormControl>
  );
};

export default Panorama;
  