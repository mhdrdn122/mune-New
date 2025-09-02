// This file manages the Invoices UI in the admin panel, including rendering the invoice table,
// pagination, invoice actions (view, pay, receive, add service), and modals for dynamic forms.

import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ToastContainer } from "react-toastify";
import Pagination from "../../../utils/Pagination";
import {
  useAddInvoiceMutation,
  useGetInvoicesQuery,
  useUpdateInvoiceMutation,
} from "../../../redux/slice/order/orderApi";
import useError401Admin from "../../../hooks/useError401Admin";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import ShowInvoice from "./ShowInvoice";
import { GiReceiveMoney } from "react-icons/gi";
import Table from "../../Tables/Tables";
import AttentionModal from '../../../components/Modals/AttentionModal/AttentionModal';
import {
  getAddInvoiceFormFields,
  getServiceFormField,
  handlePay,
  handleReceive,
  onAddInvoiceSubmit,
  onAddServiceSubmit
} from "./helpers";
import DynamicForm from '../../../components/Modals/AddModal/AddModal';

/**
 * InvoicesContainer Component
 * 
 * @param {boolean} show - Controls whether the "Add Invoice" modal is shown.
 * @param {Function} handleClose - Function to close the "Add Invoice" modal.
 * @param {any} refresh - Dependency used to refetch invoices.
 * @param {Array} services - List of available services.
 * @param {string} date - Filtered date for invoices.
 * @param {string} selectedTableId - Filtered table ID for invoices.
 * @param {string} selectedAdminId - Filtered waiter ID for invoices.
 * @param {Array} tables - List of tables for form generation.
 * 
 * @returns {JSX.Element} The rendered invoice table with all controls and modals.
 */
const InvoicesContainer = ({
  show,
  handleClose,
  refresh,
  services,
  date,
  selectedTableId,
  selectedAdminId,
  tables
}) => {
  // Table headers and fields to render
  const tableHeaders = [
    "رقم الفاتورة",
    "السعر الإجمالي",
    "رقم الطاولة",
    "اسم النادل",
    "تاريخ إنشاء الفاتورة",
    "حالة الفاتورة",
    "الحدث"
  ];
  const fieldsToSHow = [
    "num",
    "total",
    "number_table",
    "admin_name",
    "created_at",
    "status"
  ];

  const [page, setPage] = useState(1);
  const [passedData, setPassedData] = useState();
  const [showPay, setShowPay] = useState(false);
  const [showRecive, setShowRecive] = useState(false);
  const [showInv, setShowInv] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [loadingReceive, setLoadingReceive] = useState(null);

  const [addServiceFields, setAddServiceField] = useState();
  const [addInvoiceFields, setAddInvoiceFields] = useState();

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  // Prepare form fields for services and invoices
  useEffect(() => {
    const result = getServiceFormField(services?.data || []);
    const result1 = getAddInvoiceFormFields(tables?.data || []);
    setAddServiceField(result);
    setAddInvoiceFields(result1);
  }, [tables, services]);

  // Fetch invoices from API
  const {
    data: invoices,
    isError,
    error,
    isFetching,
    refetch
  } = useGetInvoicesQuery({ page, refresh, date, selectedTableId, selectedAdminId });
  console.log(invoices)

  const [payInvoice, { isLoading: loadPay }] = useUpdateInvoiceMutation();
  const [addInvoice] = useAddInvoiceMutation();

  // Hook to redirect on 401 errors
  const { triggerRedirect } = useError401Admin(isError, error);

  // Pagination handler
  const onPress = async (page) => {
    setPage(page);
  };

  // Action handlers
  const handleShowPay = (table) => {
    setShowPay(true);
    setPassedData(table);
  };

  const handleShowShow = (table) => {
    setShowInv(true);
    setPassedData(table);
  };

  const handleShowRecive = (table) => {
    setShowRecive(true);
    setPassedData(table);
  };

  const handleShowAddServices = (table) => {
    setShowAddService(true);
    setPassedData(table);
  };

  const handleCloseShow = () => {
    setShowInv(false);
  };

  // Action buttons configuration
  const actions = [
    {
      icon: <FaEye />,
      name: 'view',
      onClickFunction: handleShowShow
    },
    {
      icon: <EditOutlinedIcon />,
      name: 'pay',
      onClickFunction: handleShowPay
    },
    {
      icon: <GiReceiveMoney />,
      name: 'done',
      onClickFunction: handleShowRecive
    },
    {
      icon: <MdOutlineMiscellaneousServices />,
      name: 'add_service',
      onClickFunction: handleShowAddServices
    }
  ];

  return (
    <>
      {/* Table with invoices */}
      <Table
        columns={tableHeaders}
        fieldsToShow={fieldsToSHow}
        actions={actions}
        data={invoices?.data}
        error={error}
        isFetching={isFetching}
      />

      {/* Pagination if needed */}
      {invoices?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={invoices.meta.total_pages} />
      )}

      {/* View Invoice Modal */}
      <ShowInvoice
        show={showInv}
        handleClose={handleCloseShow}
        id={passedData?.id}
      />

      {/* Confirm Pay Modal */}
      <AttentionModal
        handleClose={() => setShowPay(false)}
        loading={loadPay}
        message={"هل أنت متأكد من عملية الدفع؟"}
        title={"إتمام عملية الدفع"}
        onIgnore={() => setShowPay(false)}
        onOk={async () =>
          await handlePay(payInvoice, passedData?.id, () => setShowPay(false), triggerRedirect)
        }
        show={showPay}
      />

      {/* Confirm Receive Modal */}
      <AttentionModal
        handleClose={() => setShowRecive(false)}
        loading={loadingReceive}
        message={"هل أنت متأكد من عملية الإستلام؟"}
        title={"إتمام عملية الإستلام"}
        onIgnore={() => setShowRecive(false)}
        onOk={async () =>
          await handleReceive(passedData?.id, setLoadingReceive, () => setShowRecive(false), adminInfo)
        }
        show={showRecive}
      />

      {/* Add Service Modal */}
      <DynamicForm
        fields={addServiceFields}
        loading={false}
        onHide={() => setShowAddService(false)}
        onSubmit={async (values) =>
          await onAddServiceSubmit(values, services, passedData?.id, () => setShowAddService(false), adminInfo)
        }
        passedData={{}}
        show={showAddService}
        title={"إضافة خدمة"}
      />

      {/* Add Invoice Modal */}
      <DynamicForm
        fields={addInvoiceFields}
        loading={false}
        onHide={handleClose}
        onSubmit={async (values) =>{
          console.log(tables?.data)
           await onAddInvoiceSubmit(values, addInvoice, handleClose, tables?.data)}
        }
        passedData={{}}
        show={show}
        title={"إضافة فاتورة"}
      />

      <ToastContainer />
    </>
  );
};

export default InvoicesContainer;
