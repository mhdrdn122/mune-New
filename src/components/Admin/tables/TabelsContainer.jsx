import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { IconButton, Tooltip, Paper, Box, Typography, Chip } from "@mui/material";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer } from "react-toastify";
import AddTable from "./AddTable";
import UpdateTable from "./UpdateTable";
import ModalDelete from "../../super_admin/cities/ModalDelete";
import {
  useDeleteTableMutation,
  useGetTablesQuery,
} from "../../../redux/slice/tables/tablesApi";
import notify from "../../../utils/useNotification";
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";
import ShowTable from "./ShowTable";
import useError401Admin from "../../../hooks/useError401Admin";
import RefreshButton from "../../../utils/RefreshButton";
import Pagination from "../../../utils/Pagination";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../../context/WebSocketProvider";

// تحسين تصميم مكون الجداول
const TabelsContainer = ({ show, handleClose, refresh }) => {
  const { hasPermission } = usePermissions();
  const userData = JSON.parse(localStorage.getItem("adminInfo"));
  const [deleteTable, { isLoading }] = useDeleteTableMutation();
  const [page, setPage] = useState(1);
  const [tables, setTabels] = useState();
  const navigate = useNavigate();
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching
  } = useGetTablesQuery({page});
  
  const channel = useWebSocket(userData?.restaurant_id);
  useEffect(() => {
    channel.listen('.App\\Events\\TableUpdatedEvent', (event) => {
      console.log('📩 Event received:', event);
      setTabels(event);
      console.log(tables);
    });
  }, [channel]);
  
  useEffect(() => {
    setTabels(data);
  }, [data]);
  
  const { triggerRedirect } = useError401Admin(isError, error);

  const [showEdit, setShowEidt] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleShowEdit = (item) => {
    setShowEidt(item);
  };
  
  const handleCloseEdit = () => {
    setShowEidt(false);
  };

  const handleShowDelete = (id) => {
    setShowDelete(id);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };
  
  const handleShowDetails = (item) => {
    setShowDetails(item);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  
  const handleDelete = async () => {
    try {
      const result = await deleteTable(showDelete).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleCloseDelete();
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      if (error?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", error);
        notify(error?.data?.message, "error");
      }
    }
  };

  const onPress = async (page) => {
    setPage(page);
  };
  
  console.log("tables=========================================================================")
   const getStatusColor = (status) => {
    switch(status) {
      case 1: return { color: "#FF5252", label: "طلب جديد" };
      case 2: return { color: "#FFC107", label: "قيد المعالجة" };
      case 3: return { color: "#4CAF50", label: "مكتمل" };
      default: return { color: "transparent", label: "" };
    }
  };
  
  return (
    <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
          إدارة الطاولات
        </Typography>
      </Box>
      
      <div className="table-responsive table_container">
        <table className="table" dir="rtl" style={{ margin: 0 }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th className="col-6" style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}> رقم الطاولة </th>
              <th className="col-6" style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>الإجراءات</th>
            </tr>
          </thead>
          {isFetching || loading ? (
            <tbody>
              <tr>
                <td colSpan="2">
                  <div className="my-4 text-center">
                    <p className="mb-2" style={{ fontSize: '16px', color: '#666' }}>جار التحميل</p>
                    <Spinner
                      className="m-auto"
                      animation="border"
                      role="status"
                      style={{ color: '#3f51b5' }}
                    ></Spinner>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : isError ? (
            <tbody>
              <tr>
                <td colSpan="2">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                      {error?.data?.message || 'حدث خطأ أثناء تحميل البيانات'}
                    </Typography>
                    <RefreshButton handleClick={refetch} />
                  </Box>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {tables && tables?.data?.length ? (
                tables?.data?.map((item) => (
                  <tr key={item.id} style={{ 
                    transition: 'all 0.3s ease',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}>
                    <td style={{ 
                      textAlign: "center", 
                      padding: '15px',
                      verticalAlign: 'middle',
                      fontSize: '16px'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {item.number_table}
                        </Typography>
                        {(item.new === 1 || item.new === 2 || item.new === 3) && (
                          <Chip 
                            size="small"
                            label={getStatusColor(item.new).label}
                            sx={{ 
                              backgroundColor: getStatusColor(item.new).color,
                              color: '#fff',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </Box>
                    </td>
                    <td 
                      className="table-actions" 
                      style={{ 
                        display: "flex", 
                        justifyContent: 'center', 
                        alignItems: "center", 
                        gap: "15px",
                        padding: '15px'
                      }}
                    >
                      {hasPermission(PermissionsEnum.ORDER_INDEX) &&
                        userData.restaurant.is_order === 1 && (
                          <Tooltip placement="top" title="طلبات الطاولة">
                            <IconButton
                              sx={{ 
                                color: "#1976d2",
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                              }}
                              onClick={() => navigate(`/admin/tables/${item.id}/orders`)}
                            >
                              <BsFillCartCheckFill />
                            </IconButton>
                          </Tooltip>
                        )}
                      <Tooltip placement="top" title="عرض التفاصيل">
                        <IconButton
                          sx={{ 
                            color: "#4caf50",
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' }
                          }}
                          onClick={() => handleShowDetails(item)}
                        >
                          <FaEye />
                        </IconButton>
                      </Tooltip>
                  
                      {hasPermission(PermissionsEnum.TABLE_UPDATE) && (
                        <Tooltip placement="top" title="تعديل">
                          <IconButton 
                            sx={{ 
                              color: "#ff9800",
                              '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.08)' }
                            }}
                            onClick={() => handleShowEdit(item)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {hasPermission(PermissionsEnum.TABLE_DELETE) && (
                        <Tooltip placement="top" title="حذف">
                          <IconButton 
                            sx={{ 
                              color: "#f44336",
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' }
                            }}
                            onClick={() => handleShowDelete(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </td>
                  </tr>                
                ))
              ) : (
                <tr>
                  <td colSpan="2">
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      py: 4
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        لا توجد بيانات
                      </Typography>
                    </Box>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {tables?.meta?.total_pages > 1 && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination onPress={onPress} pageCount={tables?.meta?.total_pages} />
        </Box>
      )}

      <AddTable show={show} handleClose={handleClose} />
      <UpdateTable show={showEdit} handleClose={handleCloseEdit} />
      <ShowTable show={showDetails} handleClose={handleCloseDetails} />

      <ModalDelete
        show={showDelete}
        handleClose={handleCloseDelete}
        loading={""}
        error={""}
        handleDelete={handleDelete}
      />

      <ToastContainer />
    </div>
  );
};

export default TabelsContainer;
