import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
} from "@mui/material";
import { Modal, Button as BootstrapButton, Spinner } from "react-bootstrap";
import { useMediaQuery } from "@uidotdev/usehooks";
import notify from "../../../utils/useNotification";
import avatar from "../../../assets/avatar.png";
import useGetStyle from "../../../hooks/useGetStyle";

export default function DynamicForm({
  title,
  fields,
  onSubmit,
  show,
  onHide,
  loading,
  passedData,
}) {
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { Color } = useGetStyle();

  const handleChange = (name, value) => {
    console.log(name)
    console.log(value)

    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onSubmit(formValues);
      notify(response?.message, "success");
      setFormValues({});
      onHide();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.status === "FETCH_ERROR") {
        notify("No Internet Connection", "error");
      } else {
        notify(error?.data?.message, "error");
      }
    }
  };

  useEffect(() => {
    if (show && passedData && fields) {
      const initialValues = {};
      fields.forEach((field) => {
        if (field.name in passedData && field.type !== "select") {
          initialValues[field.name] = passedData[field.name];
        }
      });
      setFormValues(initialValues);
    }
    console.log(formValues);
    console.log(fields);
  }, [show, passedData, fields]);

  return (
    <div>
      <Modal show={show} onHide={onHide} centered style={{ zIndex: 1050  }}>
        <Modal.Header className="d-flex justify-content-center border-0" style={{ background: "#" + Color +"15"  }} >
          <Modal.Title
            style={{
              color: "#" + Color,
            }}
            className="  fw-bold text-center w-100"
          >
            {title}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit} style={{ background: "#" + Color +"15"  }} >
          {loading ? (
            <Modal.Body >
              <Spinner className="m-auto" animation="border" role="status" />
            </Modal.Body>
          ) : (
            <Modal.Body className="d-flex flex-column justify-content-center align-items-center p-4">
              {fields?.map((field) => {
                if (field?.isHidden && field?.isHidden(formValues )) {
                  return null;
                }
                if (field?.type === "image") {
                  return (
                    <div
                      style={{
                        border:` 2px dashed ${"#" + Color  }`,
                        padding: "20px",
                        borderRadius: "12px",
                        backgroundColor: "#" + Color +"15" ,
                        textAlign: "center",
                        marginBottom: "16px",
                      }}
                       className="w-full"
                      key={field?.name}
                    >
                      <label htmlFor="upload-photo">
                        <img
                          src={
                            typeof formValues[field?.name] === "undefined" ||
                            (typeof formValues[field?.name] === "string" &&
                              formValues[field?.name].length === 0)
                              ? avatar
                              : typeof formValues[field?.name] === "string" &&
                                formValues[field?.name].length > 0
                              ? formValues[field?.name]
                              : URL.createObjectURL(formValues[field?.name])
                          }
                          alt="click"
                          width="300px"
                          height="160px"
                          style={{ cursor: "pointer", objectFit: "contain" }}
                        />
                        <input
                          hidden
                          id="upload-photo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              console.log("onChange");
                              handleChange(field.name, file);
                            }
                          }}
                          style={{ marginTop: "8px" , background: "#" + Color +"15"  }}
                        />
                      </label>
                    </div>
                  );
                } else if (field?.type === "select" && field?.options) {
                  return (
                    <FormControl fullWidth margin="normal" key={field?.name}>
                      <InputLabel>{field?.label}</InputLabel>
                      <Select
                        value={formValues[field?.name] || ""}
                        onChange={(e) =>
                          handleChange(field?.name, e.target.value)
                        }
                        label={field?.label}
                      >
                        {field?.options.map((option) => (
                          <MenuItem key={option} value={option} style={{ background: "#" + Color +"15"  }}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                } else if (field?.type === "multiselect" && field?.options) {
                  return (
                    <FormControl fullWidth margin="normal" key={field?.name}>
                      <InputLabel>{field?.label}</InputLabel>
                      <Select
                        inputLabelProps={{ shrink: true }}
                        multiple
                        value={formValues[field?.name] || []}
                        onChange={(e) =>
                          handleChange(field?.name, e.target.value)
                        }
                        input={<OutlinedInput label={field?.label} />}
                        renderValue={(selected) =>
                          selected.map((item) => item.name).join(", ")
                        }
                        style={{ background: "#" + Color +"15"  }}
                      >
                        {field?.options.map((option) => (
                          
                          <MenuItem key={option.name} value={option} style={{ background: "#" + Color +"15"  }}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                } else {
                  const computedInputProps =
                    typeof field.inputProps === "function"
                      ? field.inputProps(formValues)
                      : {};
                  return (
                    <TextField
                      key={field?.name}
                      label={field?.label}
                      type={field?.type}
                      name={field?.name}
                      required={field?.required}
                      value={formValues[field?.name] || ""}
                      onChange={(e) =>
                        handleChange(field?.name, e.target.value)
                      }
                      fullWidth
                      margin="normal"
                      dir={field?.dir}
                      inputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputProps: computedInputProps,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#" + Color + "5",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#" + Color + "15",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#" + Color ,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#" + Color,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#" + Color,
                        },
                      }}
                    />
                  );
                }
              })}
            </Modal.Body>
          )}
          <Modal.Footer className="flex  items-center justify-content-around  w-full  p-4 border-0">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#" + Color ,
                color: "#FFF",
              }}
              onClick={() => {
                onHide();
                setFormValues({});
              }}
            >
              تجاهل
            </Button>
            {isLoading === true ? (
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#" + Color,
                  color: "#FFF",
                }}
              >
                <Spinner className="m-auto" animation="border" role="status" />
              </Button>
            ) : (
              <Button
                variant="contained"
                type="submit"
                style={{
                  backgroundColor: "#" + Color,
                  color: "#FFF",
                }}
              >
                حفظ
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
