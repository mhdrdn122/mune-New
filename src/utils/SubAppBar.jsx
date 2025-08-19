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

const SubAppBar = ({
  title = "User",
  onSearch = () => {},
  onAdd = () => {},
  onViewToggle = () => {},
  viewMode = "list",
  filterOptions = [],
  onFilterChange = () => {},
  initialFilterValue = "",
  initialSearchValue = "",
  showSearch = false,
  showFilter = false,
  showAddButton = false,
  showViewToggle = false,
  // New props
  requiredPermission,
  setRefresh,
  refresh,
  showRefreshButton = false,
  services,
  onAddService,
  showServicesButton = false,
  onDownloadExcel,
  showDownloadButton = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [filterValue, setFilterValue] = useState(initialFilterValue);
  const open = Boolean(anchorEl);
  const { hasPermission } = usePermissions();

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

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    onFilterChange(value);
  };

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
            color: "#2F4B26",
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
                backgroundColor: "#2F4B26",
                borderRadius: "8px",
                width: "40px",
                height: "40px",
                "&:hover": {
                  backgroundColor: "#1E3521",
                },
              }}
              onClick={handleRefresh}
            >
              <RefreshIcon sx={{ color: "#fff", fontSize: "1.2rem" }}  />
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
                    borderColor: "#2F4B26",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2F4B26",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2F4B26",
                    boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#2F4B26" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "20px",
                  height: "40px",
                },
              }}
            />
          )}

          {/* Filter dropdown */}
          {showFilter && filterOptions.length > 0 && (
            <Select
              size="small"
              value={filterValue}
              onChange={handleFilterChange}
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
                  borderColor: "#2F4B26",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2F4B26",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2F4B26",
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
                  <FilterIcon fontSize="small" sx={{ color: "#2F4B26" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                <em>الكل</em>
              </MenuItem>
              {filterOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: "0.875rem" }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Add service button */}
          {showServicesButton && hasPermission(requiredPermission?.services) && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3f51b5",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
                boxShadow: "none",
                padding: "8px 16px",
                height: "40px",
                minWidth: "auto",
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
              startIcon={<ServicesIcon sx={{ fontSize: "1rem" }} />}
              onClick={onAddService}
            >
              إضافة خدمة
            </Button>
          )}

          {/* Add button */}
          {showAddButton && hasPermission(requiredPermission?.Add) && (
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
              إضافة
            </Button>
          )}

          {/* Download Excel button */}
          {showDownloadButton && hasPermission(requiredPermission?.Download) && (
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
              {viewMode === "list" ? (
                <ViewModuleIcon sx={{ color: "#2F4B26", fontSize: "1.2rem" }} />
              ) : (
                <ViewListIcon sx={{ color: "#2F4B26", fontSize: "1.2rem" }} />
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
              <MoreIcon sx={{ color: "#2F4B26", fontSize: "1.2rem" }} />
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
                    color: "#2F4B26",
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
                          borderColor: "#2F4B26",
                        },
                        "&:hover fieldset": {
                          borderColor: "#2F4B26",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2F4B26",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#2F4B26" }} />
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

              {/* Filter in mobile */}
              {showFilter && filterOptions.length > 0 && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Select
                    size="small"
                    value={filterValue}
                    onChange={handleFilterChange}
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
                        borderColor: "#2F4B26",
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <FilterIcon
                          fontSize="small"
                          sx={{ color: "#2F4B26" }}
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                      <em>الكل</em>
                    </MenuItem>
                    {filterOptions.map((option) => (
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
              )}

              {(showSearch || showFilter) && <Divider sx={{ my: 1 }} />}

              {/* Add service in mobile */}
              {showServicesButton &&
                hasPermission(requiredPermission.services) && (
                  <MenuItem
                    onClick={() => {
                      onAddService?.();
                      handleMenuClose();
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#3f51b5",
                      fontWeight: 500,
                    }}
                  >
                    <ServicesIcon fontSize="small" />
                    إضافة خدمة
                  </MenuItem>
                )}

              {/* Add button in mobile */}
              {showAddButton && hasPermission(requiredPermission.Add) && (
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
                  إضافة
                </MenuItem>
              )}

              {/* Download Excel in mobile */}
              {showDownloadButton &&
                hasPermission(requiredPermission.Download) && (
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
                    color: "#2F4B26",
                  }}
                >
                  {viewMode === "list" ? (
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
