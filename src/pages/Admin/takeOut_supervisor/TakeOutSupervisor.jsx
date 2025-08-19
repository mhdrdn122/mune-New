// This file manages admin-related interfaces or functionality.

import React, { useEffect, useState } from 'react'
import { useGetTakeoutOrdersQuery } from '../../../redux/slice/takeoutOrders/takeoutOrdersApi';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../utils/Pagination'
import { Spinner ,Button} from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { IconButton,} from "@mui/material";
  import notify from '../../../utils/useNotification';
  import { usePermissions } from '../../../context/PermissionsContext';
  import { LiaFileInvoiceSolid } from 'react-icons/lia';
  import { PermissionsEnum } from '../../../constant/permissions';
  import { CgUnblock } from 'react-icons/cg';
  import { ListGroup, Modal, Table } from 'react-bootstrap'
  import { FaBuilding, FaMoneyBillAlt, FaMoneyBillWave, FaReceipt, FaTools } from 'react-icons/fa'
import axios from 'axios';
import { baseURLLocalPublic } from '../../../Api/baseURLLocal';
import * as Yup from "yup";

import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormik } from 'formik';
import { ToastContainer } from 'react-toastify';
import { GiReceiveMoney } from "react-icons/gi";
import useRandomNumber from '../../../hooks/useRandomNumber';
import Header from '../../../utils/Header';
import SearchableSelect from '../../../utils/SearchableSelect';
import { FaMotorcycle } from "react-icons/fa6";
import { resetAuthState } from '../../../redux/slice/auth/authSlice';

const breadcrumbs = [
    {
      label: "الطلبات الخارجية",
    },
  ].reverse();

// This function `TakeOutSupervisor` handles a specific functionality in this module.
  const TakeOutSupervisor = () => {
    const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

    const [page, setPage] = useState(1);
    const [drivers,setDrivers]=useState([])
    const [selectedDriver, setSelectedDriver] = useState("");
    const [loading2,setLoading]=useState(false)
    const [invoice_id,setInvoice_id]=useState('')
    const [refresh, setRefresh] = useState(0); // State to trigger re-fetching
    const [loadingReceivedItemId, setLoadingReceivedItemId] = useState(null);
  const [showEditStatus, setShowEidtStatus] = useState(false);

// This function `getDrivers` handles a specific functionality in this module.
    const getDrivers= async()=>{
      const response = await axios.get(`${baseURLLocalPublic}/admin_api/show_deliveries_active`,{
        headers: {
          'Authorization': `Bearer ${adminInfo.token}`
        }
      })
      setDrivers(response?.data?.data)
    }
    useEffect(()=>{
      getDrivers()
    },[])
// This function `onPress` handles a specific functionality in this module.
    const onPress = async (page) => {
      setPage(page);
      window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
    };
    const options = [
  {
    id: "approved",
    name: "approved",
  },
  {
    id: "processing",
    name: "processing", 
  },
  {
      id: "Under delivery",
        name: "Under delivery",
  },
  {
      id: "Paid",
    name: "Paid",
  },
  {
      id: "Received",
    name: "Received",
  },
  {
    id: "rejected",
  name: "rejected",
},
  ];
// This function `handleLogout` handles a specific functionality in this module.
  const handleLogout = async () => {
    localStorage.removeItem("adminInfo");
    localStorage.clear();
    // await dispatch(resetAuthState());
    //  localStorage.clear();
  };

    const {
        data: takeoutOrders,
        isError,
        error,
        isLoading: loading,
        isFetching,
        } = useGetTakeoutOrdersQuery({  page, refresh});
  
        const navigate = useNavigate();

        const { hasPermission } = usePermissions();
          const [showOrder,setShowOrder]=useState(false)
          const [showEditModal,setShowEditModal]=useState(false)
          const [showDeleteModal,setShowDeleteModal]=useState(false)
        
// This function `handleShowOrder` handles a specific functionality in this module.
        const handleShowOrder=(order)=>{
          setShowOrder(order)
        }

// This function `handleCloseShowOrder` handles a specific functionality in this module.
        const handleCloseShowOrder=(orders)=>{
          setShowOrder(false)
        }

// This function `handleShowEdit` handles a specific functionality in this module.
        const handleShowEdit=(order)=>{
            formik.setFieldValue('invoice_id',order.id)
            setShowEditModal(order)
        }
// This function `handleCloseShowEdit` handles a specific functionality in this module.
        const handleCloseShowEdit=()=>{
          setShowEditModal(false)
        }
// This function `handleShowDelete` handles a specific functionality in this module.
        const handleShowDelete=(id)=>{
          console.log('id : ',id)
          setShowDeleteModal(id)
        }
// This function `handleCloseShowDelete` handles a specific functionality in this module.
        const handleCloseShowDelete=()=>{
          setShowDeleteModal(false)
        }
        const formik = useFormik({
            initialValues: {
              delivery_id: "",
            },
          enableReinitialize: true,

            onSubmit: async (values ,actions) => {
              if(values.type_id === ""){
                delete values.type_id
              }
              setLoading(true)
              console.log('values : ',values)
              try {
                const result = await axios.post(`${baseURLLocalPublic}/admin_api/give_order_to_delivery`,{
                delivery_id:values.delivery_id,
                invoice_id:values.invoice_id,
              },{
                headers:{
                  'Authorization': `Bearer ${adminInfo.token}`
                }
              })
              console.log('result : ',result)
              
              if (result?.data?.status === true) {
                notify(result?.data?.message, "success");
                formikStatus.resetForm();
                handleCloseShowEdit();
                setRefresh((prev) => prev + 1);
              }
              } catch (error) {
                console.log('error : ',error)     
                notify(error?.response?.data?.message,"error")   
              }finally{
                setLoading(false)
              }
            },
          })

// This function `handleReceive` handles a specific functionality in this module.
          const handleReceive = async (invoiceId) => {
            const url = `${baseURLLocalPublic}/admin_api/update_status_invoice_received?id=${invoiceId}`;
              setLoadingReceivedItemId(invoiceId)
            try {
            let response = await fetch(url, {
              method: "PATCH",
              headers: {
                "Authorization": `Bearer ${adminInfo.token}`,
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              response = await response.json();
              // Handle errors (e.g., 4xx or 5xx status codes)
              setTimeout(()=>{
                notify(response.message,"error")
              },200)
              return
            }
        
            const result = await response.json();
            console.log("Invoice updated successfully:", result);
            notify(result.message,"success")
            // Optionally, update UI or state after a successful response
          } catch (error) {
            // Handle network or unexpected errors
            console.log("Error while updating invoice:", error);
            notify(result.message,"error")
          }finally{
            setLoadingReceivedItemId(null)
          }
          }

// This function `handleDelete` handles a specific functionality in this module.
          const handleDelete=async(id)=>{
            console.log('id inside delete Modal : ',id)
            setLoading(true)
            try {
              const response = await axios.delete(`${baseURLLocalPublic}/admin_api/delete_order_takeout`, {
                headers:{
                  "Authorization":`Bearer ${adminInfo.token}`,
                },
                params:{id}
              })
              console.log('result : ',response)
              notify(response?.data?.message,"success")
              handleCloseShowDelete()
              setRefresh((prev) => prev + 1);
            } catch (error) {
              notify(error?.response?.data?.message,"error")   
            }finally{
              setLoading(false)
            }
          }
// This function `handleShowEditStatus` handles a specific functionality in this module.
          const handleShowEditStatus = (order) => {
            console.log('edit status : ',order)
            setShowEidtStatus(order);
          };
// This function `handleCloseEditStatus` handles a specific functionality in this module.
          const handleCloseEditStatus = () => {
            setShowEidtStatus(false);
          };

          const formikStatus = useFormik({
            initialValues: {
              id: showEditStatus?.id,
              status: showEditStatus?.status,
            },
            enableReinitialize: true,
            onSubmit: async (values, { setErrors }) => {
                setLoading(true)
              try {
                const result = await axios.post(
                    `${baseURLLocalPublic}/admin_api/update_takeout`,
                    {
                      id: values.id,
                      status: values.status,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${adminInfo.token}`, // Replace with your actual token variable
                      },
                    }
                  )
                console.log("result of edit status:", result);
                console.log('resulttt : ',result)
                if (result?.data?.status === true) {
                  notify(result?.data?.message, "success");
                  formikStatus.resetForm();
                  handleCloseEditStatus();
              setRefresh((prev) => prev + 1);
                }
              } catch (error) {
                console.log("Failed to add service:", error);
                notify(error?.response?.data?.message,"error")
                if (error.status === "FETCH_ERROR") {
                  notify("No Internet Connection", "error");
                } else {
                  notify(error.data.message, "error");
                  const backendErrors = error.data.errors;
                  const formattedErrors = {};
                  for (const key in backendErrors) {
                    formattedErrors[key] = backendErrors[key][0];
                  }
                  console.log(formattedErrors);
                  setErrors(formattedErrors);
                }
              }finally{
                setLoading(false)
              }
            },
            validationSchema: Yup.object({
            }),
          });
          return (
    <div>
        {/* <Breadcrumb breadcrumbs={breadcrumbs} /> */}
        <div style={{
            width:'100%',
        }} className=''>
            <button onClick={() => {
              handleLogout();
              navigate("/admin/logintakeout");
            }}
                style={{
                    // width:'100px',
                    height:'50px',
                    border:'none',
                    outline:'none',
                    margin:'20px',
                    backgroundColor:'#1F2A40',
                    color:'white',
                    borderRadius:'10px'
                }}
            >تسجيل الخروج
            </button>
        </div>
            <div className='text-end me-5 mb-4'>
            <h3>الطلبات الخارجية</h3>
            <h4>{adminInfo?.type} : الدور</h4>
            </div>
        <div className="table-responsive table_container">
        <table className="table" dir="rtl">
          <thead>
            <tr>
              <th className="col"> اسم الزبون </th>
              <th className="col"> اسم السائق </th>
              <th className="col"> العنوان </th>
              <th className="col"> رقم الموبايل </th>
              <th className="col"> تاريخ الإنشاء</th>
              <th className="col"> تاريخ التسليم</th>
              <th className="col"> الحالة </th>
              <th className="col-2">الحدث </th>
            </tr>
          </thead>
          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="7">
                  <div className="my-4 text-center">
                    <p className="mb-2">جار التحميل</p>
                    <Spinner
                      className="m-auto"
                      animation="border"
                      role="status"
                    ></Spinner>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan="7">
                  <p className="my-5">{error.data?.message}</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {takeoutOrders && takeoutOrders.data && takeoutOrders.data.length > 0 ? (
                takeoutOrders.data.map((order, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: "center" }}>{order.user}</td>
                    <td style={{ textAlign: "center" }}>{order.delivery_name}</td>
                    <td style={{ textAlign: "center",width:'110px' }}>{order.region || "..." } </td>
                    <td style={{ textAlign: "center" }}>
                      {order.user_phone || "..."}
                    </td>
                    <td style={{ textAlign: "center",width:'110px' }}>{order.created_at || "..." }</td>
                    <td style={{ textAlign: "center",width:'110px' }}>{order.customer_received_at|| "..." }</td>
                    <td style={{ textAlign: "center" }}>
                     
                        <span 
                        style={{backgroundColor:'#1F2A40'}} className="text-white p-1 rounded">
                          {order.status}
                        </span>
                    </td>
                    <td className="">
                      {
                        <IconButton sx={{ color: "#000" }}
                        onClick={() => handleShowOrder(order)}
                            >
                          <FaEye />
                        </IconButton>
                      }
                      {hasPermission(PermissionsEnum.USER_UPDATE) && (
                        <IconButton sx={{ color: "#000" }}>
                          <FaMotorcycle onClick={() => handleShowEdit(order)}
                          />
                        </IconButton>
                      )}
                        {hasPermission(PermissionsEnum.ORDER_UPDATE) && (
                        <IconButton sx={{ color: "#000" }} onClick={() => {}}>
                          <EditOutlinedIcon
                            onClick={() => handleShowEditStatus(order)}
                          />
                        </IconButton>
                      )}
                      {/* {hasPermission(PermissionsEnum.ORDER_DELETE) && (
                        <IconButton onClick={()=>{}}
                        sx={{ color: "#000" }}>
                          <DeleteIcon  onClick={() => handleShowDelete(order.id)} />
                        </IconButton>
                      )} */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <p className="my-5">لا توجد بيانات</p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
          
        </table>
      </div>
                                            {/* Show Modal */}
         <Modal 
          show={showOrder}
          onHide={handleCloseShowOrder}
          centered
          style={{ direction: "rtl" }}
          size="lg"
            >
            <Modal.Header>
                <Modal.Title>تفاصيل الطلب</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {/* Invoice Summary */}
            <h5>ملخص الفاتورة</h5>
                  <Table striped bordered hover size="sm">
                    <tbody>
                      <tr>
                        <td>رقم الفاتورة</td>
                        <td>{showOrder.num}</td>
                      </tr>
                      <tr>
                        <td>تاريخ الإنشاء</td>
                        <td>{showOrder.created_at}</td>
                      </tr>
                    </tbody>
                  </Table>

                    {/* Orders List */}
                  <h5>تفاصيل الطلبات</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>السعر</th>
                        <th>العدد</th>
                        <th>المجموع</th>
          
                      </tr>
                    </thead>
                    <tbody>
                      {showOrder?.orders?.map((order) => (
                        <tr key={order.id}>
                          <td>{order.name_ar}</td>
                          <td>{order.price}</td>
                          <td>{order.count}</td>
                          <td>{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                    {/* Additional Information - New Style */}
                    <h5 className="mt-4">معلومات إضافية</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <FaMoneyBillAlt className="me-2" /> <strong>المجموع:</strong>{" "}
                        {showOrder.price} 
                      </ListGroup.Item>
                    {
                        showOrder.delivery_price &&
                          <ListGroup.Item>
                          <FaTools className="me-2" /> <strong>سعر التوصيل:</strong>{" "}
                          {showOrder.delivery_price}
                        </ListGroup.Item>
                    } 
                                        {
                        showOrder.discount &&
                          <ListGroup.Item>
                          <FaTools className="me-2" /> <strong>سعر الخصم :</strong>{" "}
                          {showOrder.discount}
                        </ListGroup.Item>}

                    { showOrder.total_with_delivery_price &&         
                        <ListGroup.Item>
                          <FaReceipt className="me-2" /> <strong>الإجمالي:</strong>{" "}
                          {showOrder.total_with_delivery_price} {/* Total invoice */}
                        </ListGroup.Item> 
                    }
                    </ListGroup>
                  </Modal.Body>
            </Modal>

                                  {/* Edit Driver Modal */}
            <Modal 
             show={showEditModal}
             onHide={handleCloseShowEdit}
             centered
             style={{ direction: "rtl" }}
             size="md">
              <Modal.Header className='text-center'>
                <Modal.Title className='text-center'>تفاصيل الطلب</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              sx={{ gridColumn: "span 2" }}
            >
              <InputLabel id="delivery_id">Driver</InputLabel>
              <Select
                InputLabelProps={{ shrink: true }}
                labelId="delivery_id"
                id="delivery_id"
                name="delivery_id"
                label="delivery_id"
                value={formik.values.delivery_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                >
                {drivers &&
                  drivers.map((driver) => (
                    <MenuItem
                      key={driver.id}
                      value={driver.id}
                      style={{
                        display:'flex',
                        justifyContent:'space-around',
                        alignItems:'center',
                        textAlign:'start'
                      }}
                    >
                       <p>{driver.name} </p>
                       <p className=''> {driver?.distance?`${driver?.distance.toFixed(3)} km`:'un provided'}  </p>
                </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Modal.Footer className='d-flex justify-content-center gap-5'>
          <Button variant="secondary" className='w-25 p-2'  onClick={handleCloseShowEdit} >
                  تجاهل
          </Button>
            <Button variant="success" className='w-25 p-2' style={{
              backgroundColor:'#1F2A30'
            }}  onClick={formik.handleSubmit} >
           {loading2?<Spinner></Spinner>:'حفظ'}
          </Button>
            </Modal.Footer>
              </Modal.Body>
            </Modal>

                                   {/* Delete Modal */}
            <Modal
              show={showDeleteModal}
              onHide={handleCloseShowDelete}
              centered
              style={{ direction: "rtl" }}
            >
      <Modal.Header closeButton>
        <Modal.Title>تأكيد عملية الحذف</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )} */}
        هل انت متاكد من حذف هذا العنصر ؟
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseShowDelete}>
          تجاهل
        </Button>
        {loading ? (
          <Button variant="danger" onClick={handleDelete} disabled>
            حفظ
          </Button>
        ) : (
          <Button variant="danger"  onClick={()=>handleDelete(showDeleteModal)} >
            حفظ
          </Button>
        )}
      </Modal.Footer>
             </Modal>

                                {/* Edit Status */}
    <Modal show={showEditStatus} onHide={handleCloseEditStatus} centered>
        <form onSubmit={formikStatus.handleSubmit} autoComplete="off">
          <Modal.Header className="d-flex justify-content-center">
            <Modal.Title>تعديل طلب</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SearchableSelect
              label="الحالة"
              options={options} // Pass the category data
              formik={formikStatus} // Pass the formik instance
              name="status" // Field name in formik
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="mx-2" onClick={handleCloseEditStatus}>
              تجاهل
            </Button>

            {loading2 === true ? (
              <Button variant="contained" className="">
                <Spinner
                  className="m-auto"
                  animation="border"
                  role="status"
                  size="sm"
                ></Spinner>
              </Button>
            ) : (
              <Button
                variant="contained"
                type="submit"
                className=""
                onClick={() => {}}
                style={{
                    color:'white',
                    backgroundColor:'#1F2A30'
                }}
              >
                حفظ
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
          <ToastContainer />
          {takeoutOrders?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={takeoutOrders?.meta?.total_pages} />
      )}
            
    </div>
  )
}

export default TakeOutSupervisor