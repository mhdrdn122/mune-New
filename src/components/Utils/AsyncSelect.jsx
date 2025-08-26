import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Modal, Button as BootstrapButton } from "react-bootstrap";

export default function DynamicForm({title, fields, onSubmit,show,onHide }) {
  const [formValues, setFormValues] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues)
    onSubmit(formValues);
    setShowModal(false); // Close modal after submit
  };

  return (
    <div>
      {/* Modal */}
      <Modal show={show} onHide={onHide} centered >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => {
              if (field.type === "select" && field.options) {
                return (
                  <FormControl fullWidth margin="normal" key={field.name}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={formValues[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      label={field.label}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              if (field.type === "multiselect" && field.options) {
                return (
                  <FormControl fullWidth margin="normal" key={field.name}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      multiple
                      value={formValues[field.name] || []}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      input={<OutlinedInput label={field.label} />}
                      renderValue={(selected) => (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </div>
                      )}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Checkbox checked={(formValues[field.name] || []).indexOf(option) > -1} />
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              if (field.type === "checkbox") {
                return (
                  <FormControlLabel
                    key={field.name}
                    control={
                      <Checkbox
                        checked={formValues[field.name] || false}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                      />
                    }
                    label={field.label}
                  />
                );
              }

              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  value={formValues[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              );
            })}

            <Button type="submit" variant="contained" style={{ marginTop: 16 }}>
              Submit
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
