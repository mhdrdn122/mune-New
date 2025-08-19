import { useEffect, useState } from 'react'
import { useGetTakeoutOrdersQuery } from '../../redux/slice/takeoutOrders/takeoutOrdersApi';
import { Spinner } from "react-bootstrap";
import { FaEye, FaMotorcycle } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Table from "../../components/Tables/Tables";
import { ListGroup, Modal, Table as Tb } from 'react-bootstrap';
import { FaBuilding, FaMoneyBillAlt, FaMoneyBillWave, FaReceipt, FaTools } from 'react-icons/fa';
import axios from 'axios';
import { baseURLLocalPublic } from '../../Api/baseURLLocal';
import { ToastContainer } from 'react-toastify';
import { GiReceiveMoney } from "react-icons/gi";
import { TbDiscount } from 'react-icons/tb';
import DynamicForm from '../../components/Modals/AddModal/AddModal';
import { getEditFields, handleReceive, handleUpdateOrder } from './helpers';

const TakeoutOrdersContainer = ({refresh}) => {
  const tableHeader = [
    "اسم الزبون", "اسم السائق", "العنوان", "رقم الموبايل",
    "تاريخ الانشاء", "تاريخ التسليم", "أجرة التوصيل", "الحالة", "الحدث"
  ];
  const fieldsToShow = [
    "user", "delivery_name", "delivery_address", "user_phone",
    "created_at", "customer_received_at", "delivery_price", "status"
  ];

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState();
  const [drivers, setDrivers] = useState([]);
   const [loadingReceivedItemId, setLoadingReceivedItemId] = useState(null);
  const [passedData, setPassedData] = useState();

  const [showOrder, setShowOrder] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${baseURLLocalPublic}/admin_api/show_deliveries_active`,
        {
          headers: {
            'Authorization': `Bearer ${adminInfo.token}`
          }
        }
      );
      setDrivers(response?.data?.data);
      const result = getEditFields(response?.data?.data);
      setFields(result);
    })();
  }, []);

  useEffect(() => {} ,[refresh])

  const {
    data: takeoutOrders,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useGetTakeoutOrdersQuery({ page, refresh });

  const handleShowEdit = (order) => {
    setPassedData(order);
    setShowEditModal(true);
  };

  const handleShowOrder = (order) => {
    setShowOrder(true);
    setPassedData(order);
  };

  const actions = [
    {
      icon: <FaEye />,
      name: 'view',
      onClickFunction: handleShowOrder,
    },
    {
      icon: <EditOutlinedIcon />,
      name: 'edit',
      onClickFunction: handleShowEdit,
    },
    {
      icon:
        loadingReceivedItemId === true
          ? <Spinner size="sm" />
          : <GiReceiveMoney />,
      name: 'recive',
      onClickFunction: async (data) =>
        await handleReceive(data?.id, setLoadingReceivedItemId, adminInfo),
    },
  ];

  return (
    <>
      <Table
        actions={actions}
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        data={takeoutOrders?.data}
        error={error}
        isFetching={isFetching}
      />

      <Modal
        show={showOrder}
        onHide={() => setShowOrder(false)}
        centered
        style={{ direction: "rtl" }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>تفاصيل الطلب</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5>ملخص الفاتورة</h5>
          <Tb striped bordered hover size="sm">
            <tbody>
              <tr>
                <td>رقم الفاتورة</td>
                <td>{passedData?.num}</td>
              </tr>
              <tr>
                <td>تاريخ الإنشاء</td>
                <td>{passedData?.created_at}</td>
              </tr>
            </tbody>
          </Tb>

          <h5 className="mt-4">تفاصيل الطلبات</h5>
          <Tb striped bordered hover size="sm">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>السعر</th>
                <th>العدد</th>
                <th>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {passedData?.orders?.map(({ id, name_ar, price, count, total }) => (
                <tr key={id}>
                  <td>{name_ar}</td>
                  <td>{price}</td>
                  <td>{count}</td>
                  <td>{total}</td>
                </tr>
              ))}
            </tbody>
          </Tb>

          <h5 className="mt-4">معلومات إضافية</h5>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FaMoneyBillAlt className="me-2" />
              <strong>المجموع:</strong> {showOrder?.price}
            </ListGroup.Item>

            {[
              {
                condition: showOrder?.consumer_spending,
                icon: <FaMoneyBillWave className="me-2" />,
                label: "الإنفاق الاستهلاكي:",
                value: showOrder.consumer_spending,
              },
              {
                condition: showOrder?.local_administration,
                icon: <FaBuilding className="me-2" />,
                label: "الإدارة المحلية:",
                value: showOrder.local_administration,
              },
              {
                condition: showOrder?.reconstruction,
                icon: <FaTools className="me-2" />,
                label: "إعادة الإعمار:",
                value: showOrder.reconstruction,
              },
              {
                condition: showOrder?.delivery_price,
                icon: <FaMotorcycle className="me-2" />,
                label: "أجرة التوصيل:",
                value: showOrder.delivery_price,
              },
              {
                condition: showOrder?.discount,
                icon: <TbDiscount className="me-2" />,
                label: "قيمة الحسم:",
                value: showOrder.discount,
              },
              {
                condition: showOrder?.total_with_delivery_price,
                icon: <FaReceipt className="me-2" />,
                label: "الإجمالي:",
                value: showOrder.total_with_delivery_price,
              },
            ]
              .filter((item) => item.condition)
              .map(({ icon, label, value }, index) => (
                <ListGroup.Item key={index}>
                  {icon} <strong>{label}</strong> {value}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

      {showEditModal && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={() => setShowEditModal(false)}
          onSubmit={async (values) =>
            await handleUpdateOrder(
              values,
              drivers,
              adminInfo,
              setRefresh,
              () => setShowEditModal(false),
              passedData
            )
          }
          passedData={{}}
          show={showEditModal}
          title={"تعديل الطلب"}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default TakeoutOrdersContainer;
