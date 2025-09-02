import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  AddCircle as AddCircleIcon,
  MiscellaneousServices as ServicesIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import { usePermissions } from "../context/PermissionsContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useGetStyle from "../hooks/useGetStyle";

const SubAppBar = ({
  title = "User",
  titleBtn="إضافة",
  onSearch = () => {},
  onAdd = () => {},
  onViewToggle = () => {},
  viewMode = false,
  filters = [],
  onFilterChange = () => {},
  initialSearchValue = "",
  showSearch = false,
  showFilter = false,
  showAddButton = false,
  showViewToggle = false,
  requiredPermission,
  setRefresh,
  refresh,
  showRefreshButton = false,
  services,
  onAddService,
  showServicesButton = false,
  onDownloadExcel,
  showDownloadButton = false,
  // New props for date search
  showSingleDateSearch = false,
  onSingleDateSearch = () => {},
  showDateRangeSearch = false,
  onDateRangeSearch = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [filterValues, setFilterValues] = useState(
    filters.reduce((acc, filter) => {
      acc[filter.id] = filter.initialValue || "";
      return acc;
    }, {})
  );
  const [selectedFilterType, setSelectedFilterType] = useState(
    filters.length > 0 ? filters[0].id : ""
  );
  // New states for date search
  const [singleDate, setSingleDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const open = Boolean(anchorEl);
  const { hasPermission } = usePermissions();
  const { Color } = useGetStyle();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    if (setRefresh) {
      setRefresh(!refresh);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleFilterTypeChange = (e) => {
    setSelectedFilterType(e.target.value);
  };

  const handleFilterChange = (filterId) => (e) => {
    const value = e.target.value;
    setFilterValues((prev) => {
      const newValues = { ...prev, [filterId]: value };
      onFilterChange(newValues);
      return newValues;
    });
  };

  // New handlers for date search
  const handleSingleDateChange = (newDate) => {
    setSingleDate(newDate);
    onSingleDateSearch(newDate ? dayjs(newDate).format("YYYY-MM-DD") : null);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    onDateRangeSearch(
      newDate ? dayjs(newDate).format("YYYY-MM-DD") : null,
      endDate ? dayjs(endDate).format("YYYY-MM-DD") : null
    );
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
    onDateRangeSearch(
      startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      newDate ? dayjs(newDate).format("YYYY-MM-DD") : null
    );
  };

  const renderFilters = () => {
    if (!showFilter || filters.length === 0) return null;

    if (filters.length > 2) {
      const selectedFilter = filters.find((f) => f.id === selectedFilterType) || filters[0];

      return (
        <>
          <Select
            size="small"
            value={selectedFilterType}
            onChange={handleFilterTypeChange}
            displayEmpty
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              minWidth: 180,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                minHeight: "24px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "8px",
                  marginTop: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              },
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <FilterIcon fontSize="small" sx={{ color: Color ? Color : Color ? "#" + Color : "#2F4B26" }} />
              </InputAdornment>
            }
          >
            {filters.map((filter) => (
              <MenuItem key={filter.id} value={filter.id} sx={{ fontSize: "0.875rem" }}>
                {filter.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={filterValues[selectedFilter.id] || ""}
            onChange={handleFilterChange(selectedFilter.id)}
            displayEmpty
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              minWidth: 180,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                minHeight: "24px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "8px",
                  marginTop: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              },
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <FilterIcon fontSize="small" sx={{ color: Color ? Color : Color ? "#" + Color : "#2F4B26" }} />
              </InputAdornment>
            }
          >
            <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
              <em>{selectedFilter.label}</em>
            </MenuItem>
            {selectedFilter?.options?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: "0.875rem" }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </>
      );
    }

    return filters?.map((filter) => (
      <Select
        key={filter.id}
        size="small"
        value={filterValues[filter.id] || ""}
        onChange={handleFilterChange(filter.id)}
        displayEmpty
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          minWidth: 180,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            minHeight: "24px !important",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
            boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "8px",
              marginTop: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          },
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 1 }}>
            <FilterIcon fontSize="small" sx={{ color: Color ? Color : Color ? "#" + Color : "#2F4B26" }} />
          </InputAdornment>
        }
      >
        <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
          <em>{filter.label}</em>
        </MenuItem>
        {filter?.options?.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ fontSize: "0.875rem" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    ));
  };

  const renderMobileFilters = () => {
    if (!showFilter || filters.length === 0) return null;

    if (filters.length > 2) {
      const selectedFilter = filters.find((f) => f.id === selectedFilterType) || filters[0];

      return (
        <>
          <Box sx={{ px: 2, py: 1 }}>
            <Select
              size="small"
              value={selectedFilterType}
              onChange={handleFilterTypeChange}
              displayEmpty
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  minHeight: "24px !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: Color ? Color : Color ? "#" + Color : "#2F4B26",
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 1 }}>
                  <FilterIcon fontSize="small" sx={{ color: Color ? Color : Color ? "#" + Color : "#2F4B26" }} />
                </InputAdornment>
              }
            >
              {filters?.map((filter) => (
                <MenuItem key={filter.id} value={filter.id} sx={{ fontSize: "0.875rem" }}>
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ px: 2, py: 1 }}>
            <Select
              size="small"
              value={filterValues[selectedFilter.id] || ""}
              onChange={handleFilterChange(selectedFilter.id)}
              displayEmpty
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  minHeight: "24px !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:Color ? Color : Color ? "#" + Color : "#2F4B26"
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 1 }}>
                  <FilterIcon fontSize="small" sx={{ color: Color ? Color : Color ? "#" + Color : "#2F4B26" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                <em>{selectedFilter.label}</em>
              </MenuItem>
              {selectedFilter?.options?.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: "0.875rem" }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </>
      );
    }

    return filters?.map((filter) => (
      <Box key={filter.id} sx={{ px: 2, py: 1 }}>
        <Select
          size="small"
          value={filterValues[filter.id] || ""}
          onChange={handleFilterChange(filter.id)}
          displayEmpty
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              minHeight: "24px !important",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: Color ? "#" + Color : "#2F4B26",
            },
          }}
          startAdornment={
            <InputAdornment position="start" sx={{ mr: 1 }}>
              <FilterIcon fontSize="small" sx={{ color: Color ? "#" + Color : "#2F4B26" }} />
            </InputAdornment>
          }
        >
          <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
            <em>{filter.label}</em>
          </MenuItem>
          {filter?.options?.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ fontSize: "0.875rem" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    ));
  };

  // New render function for date fields in desktop
  const renderDateFields = () => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {showSingleDateSearch && (
        <DatePicker
          label="تاريخ البحث"
          value={singleDate}
          onChange={handleSingleDateChange}
          sx={{
            backgroundColor: "white",
            // borderRadius: "20px",
            width:"150px",
            minWidth: 100,
            // "& .MuiOutlinedInput-root": {
            //   borderRadius: "20px",
            //   height: "20px",
            //   "& fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
            //   "&:hover fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
            //   "&.Mui-focused fieldset": {
            //     borderColor: Color ? "#" + Color : "#2F4B26",
            //     boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
            //   },
            // },
          }}
        />
      )}
      {showDateRangeSearch && (
        <>
          <DatePicker
            label="من تاريخ"
            value={startDate}
            onChange={handleStartDateChange}
            sx={{
            backgroundColor: "white",
            borderRadius: "20px",
            width:"150px",
            minWidth: 100,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              height: "20px",
              "& fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
              "&:hover fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
              "&.Mui-focused fieldset": {
                borderColor: Color ? "#" + Color : "#2F4B26",
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              },
            },
          }}
          />
          <DatePicker
            label="إلى تاريخ"
            value={endDate}
            onChange={handleEndDateChange}
            sx={{
            backgroundColor: "white",
            borderRadius: "20px",
            width:"150px",
            minWidth: 100,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              height: "20px",
              "& fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
              "&:hover fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
              "&.Mui-focused fieldset": {
                borderColor: Color ? "#" + Color : "#2F4B26",
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              },
            },
          }}
          />
        </>
      )}
    </LocalizationProvider>
  );

  // New render function for date fields in mobile
  const renderMobileDateFields = () => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {showSingleDateSearch && (
        <Box sx={{ px: 2, py: 1 }}>
          <DatePicker
            label="تاريخ البحث"
            value={singleDate}
            onChange={handleSingleDateChange}
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: "40px",
                "& fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                "&:hover fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                "&.Mui-focused fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
              },
            }}
          />
        </Box>
      )}
      {showDateRangeSearch && (
        <>
          <Box sx={{ px: 2, py: 1 }}>
            <DatePicker
              label="من تاريخ"
              value={startDate}
              onChange={handleStartDateChange}
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  height: "40px",
                  "& fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                  "&:hover fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                  "&.Mui-focused fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                },
              }}
            />
          </Box>
          <Box sx={{ px: 2, py: 1 }}>
            <DatePicker
              label="إلى تاريخ"
              value={endDate}
              onChange={handleEndDateChange}
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  height: "40px",
                  "& fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                  "&:hover fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                  "&.Mui-focused fieldset": { borderColor: Color ? "#" + Color : "#2F4B26" },
                },
              }}
            />
          </Box>
        </>
      )}
    </LocalizationProvider>
  );

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        boxShadow: "8px 8px 8px 0 #0000004D",
        backgroundColor: "#BDD358",
        borderRadius: "0 0 20px 20px",
        mb: 3,
        p: 1,
        direction: "rtl",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          direction: "rtl",
          padding: "8px 12px",
          minHeight: "64px !important",
        }}
      >
        {/* Title section */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: Color ? "#" + Color : "#2F4B26",
            ml: 2,
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </Typography>

        {/* Desktop controls container */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            flexGrow: 0,
            justifyContent: "flex-start",
          }}
        >
          {/* Refresh button */}
          {showRefreshButton && (
            <IconButton
              sx={{
                border: "1px solid #fff",
                backgroundColor: Color ? "#" + Color : "#2F4B26",
                borderRadius: "8px",
                width: "40px",
                height: "40px",
                "&:hover": {
                  backgroundColor: "#1E3521",
                },
              }}
              onClick={handleRefresh}
            >
              <RefreshIcon sx={{ color: "#fff", fontSize: "1.2rem" }} />
            </IconButton>
          )}

          {/* Search field */}
          {showSearch && (
            <TextField
              size="small"
              placeholder="بحث..."
              value={searchValue}
              onChange={handleSearchChange}
              sx={{
                backgroundColor: "white",
                borderRadius: "20px",
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: Color ? "#" + Color : "#2F4B26",
                  },
                  "&:hover fieldset": {
                    borderColor: Color ? "#" + Color : "#2F4B26",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: Color ? "#" + Color : "#2F4B26",
                    boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: Color ? "#" + Color : "#2F4B26" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "20px",
                  height: "40px",
                },
              }}
            />
          )}

          {/* Filters */}
          {renderFilters()}

          {/* Date fields */}
          {renderDateFields()}

          {/* Add button */}
          {showAddButton &&
            (hasPermission(requiredPermission?.Add) || requiredPermission?.Add) && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#E3170A",
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "#a00000",
                    boxShadow: "0 2px 8px rgba(48, 63, 159, 0.4)",
                  },
                  boxShadow: "none",
                  padding: "8px 16px",
                  height: "40px",
                  minWidth: "auto",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
                startIcon={<AddIcon sx={{ fontSize: "1rem" }} />}
                onClick={onAdd}
              >
                {titleBtn}
              </Button>
            )}

          {/* Download Excel button */}
          {showDownloadButton && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2E7D32",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#1B5E20",
                },
                boxShadow: "none",
                padding: "8px 16px",
                height: "40px",
                minWidth: "auto",
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
              startIcon={<DownloadIcon sx={{ fontSize: "1rem" }} />}
              onClick={onDownloadExcel}
            >
              تحميل إكسل
            </Button>
          )}

          {/* View toggle button */}
          {showViewToggle && (
            <IconButton
              sx={{
                border: "1px solid #fff",
                backgroundColor: "#BDD358",
                borderRadius: "8px",
                width: "40px",
                height: "40px",
                "&:hover": {
                  border: "1px solid #BDD358",
                  backgroundColor: "#fff",
                },
              }}
              onClick={onViewToggle}
            >
              {viewMode === false ? (
                <ViewModuleIcon sx={{ color: Color ? "#" + Color : "#2F4B26", fontSize: "1.2rem" }} />
              ) : (
                <ViewListIcon sx={{ color: Color ? "#" + Color : "#2F4B26", fontSize: "1.2rem" }} />
              )}
            </IconButton>
          )}
        </Box>

        {/* Mobile menu button */}
        {isMobile && (
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton
              sx={{
                border: "1px solid #fff",
                backgroundColor: "#BDD358",
                borderRadius: "8px",
                width: "40px",
                height: "40px",
                "&:hover": {
                  border: "1px solid #BDD358",
                  backgroundColor: "#fff",
                },
              }}
              onClick={handleMenuClick}
            >
              <MoreIcon sx={{ color: Color ? "#" + Color : "#2F4B26", fontSize: "1.2rem" }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "12px",
                  minWidth: "200px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              {/* Refresh in mobile */}
              {showRefreshButton && (
                <MenuItem
                  onClick={() => {
                    handleRefresh();
                    handleMenuClose();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: Color ? "#" + Color : "#2F4B26",
                  }}
                >
                  <RefreshIcon fontSize="small" />
                  تحديث
                </MenuItem>
              )}

              {/* Search in mobile */}
              {showSearch && (
                <Box sx={{ px: 2, py: 1 }}>
                  <TextField
                    size="small"
                    placeholder="بحث..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "20px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: Color ? "#" + Color : "#2F4B26",
                        },
                        "&:hover fieldset": {
                          borderColor: Color ? "#" + Color : "#2F4B26",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: Color ? "#" + Color : "#2F4B26",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: Color ? "#" + Color : "#2F4B26" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "20px",
                        height: "40px",
                      },
                    }}
                  />
                </Box>
              )}

              {/* Filters in mobile */}
              {renderMobileFilters()}

              {/* Date fields in mobile */}
              {renderMobileDateFields()}

              {(showSearch || showFilter || showSingleDateSearch || showDateRangeSearch) && <Divider sx={{ my: 1 }} />}

              

              {/* Add button in mobile */}
              {showAddButton &&
                (hasPermission(requiredPermission?.Add) || requiredPermission?.Add) && (
                  <MenuItem
                    onClick={() => {
                      onAdd();
                      handleMenuClose();
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#E3170A",
                      fontWeight: 500,
                    }}
                  >
                    <AddIcon fontSize="small" />
                    {titleBtn}
                  </MenuItem>
                )}

              {/* Download Excel in mobile */}
              {showDownloadButton && (
                <MenuItem
                  onClick={() => {
                    onDownloadExcel?.();
                    handleMenuClose();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#2E7D32",
                    fontWeight: 500,
                  }}
                >
                  <DownloadIcon fontSize="small" />
                  تحميل إكسل
                </MenuItem>
              )}

              {/* View toggle in mobile */}
              {showViewToggle && (
                <MenuItem
                  onClick={() => {
                    onViewToggle();
                    handleMenuClose();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: Color ? "#" + Color : "#2F4B26",
                  }}
                >
                  {viewMode === false ? (
                    <>
                      <ViewModuleIcon fontSize="small" />
                      عرض شبكي
                    </>
                  ) : (
                    <>
                      <ViewListIcon fontSize="small" />
                      عرض قائمة
                    </>
                  )}
                </MenuItem>
              )}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default SubAppBar;