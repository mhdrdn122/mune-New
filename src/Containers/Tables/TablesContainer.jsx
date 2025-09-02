import { useEffect, useState } from "react";
import { usePermissions } from "../../context/PermissionsContext";
import {
  useAddTableMutation,
  useDeleteTableMutation,
  useGetTablesQuery,
  useUpdateTableMutation,
} from "../../redux/slice/tables/tablesApi";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../context/WebSocketProvider";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "../../components/Tables/Tables";
import Pagination from "../../utils/Pagination";
import useError401Admin from "../../hooks/useError401Admin";
import DynamicForm from "../../components/Modals/AddModal/AddModal";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  getAddTableFormFields,
  handleDelete,
  onAddTableSubmit,
  onUpdateTableSubmit,
} from "./helpers";
import ShowTable from "./ShowTable";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";
import { ToastContainer } from "react-toastify";
import { Badge } from "@mui/material";
import TableCard from "../../components/Admin/tables/TableCard";
import ShowInvoice from "../../components/Admin/invoices/ShowInvoice";
import { useAddInvoiceMutation, useGetInvoicesQuery, useLazyGetInvoicesQuery } from "../../redux/slice/order/orderApi";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";
import notify from "../../utils/useNotification";

const tableHeaders = ["Table Number", "Actions"];
const fieldsToShow = ["number_table"];


/**
 * TablesContainer component for managing restaurant tables
 * Displays tables, handles invoices, and provides CRUD operations
 */
const TablesContainer = ({
  showAddTable,
  handleCloasAddTable,
  refresh,
  mode,
}) => {
  const userData = JSON.parse(localStorage.getItem("adminInfo"));
  const navigate = useNavigate();
  // const channel = useWebSocket(userData?.restaurant_id);
  const channel = useWebSocket(`restaurant${userData?.restaurant_id}`);

  const [page, setPage] = useState(1);
  const [tables, setTables] = useState();
  const [passedData, setPassedData] = useState();
  const [showInv, setShowInv] = useState(false);
  const [invoiceData, setInvoiceData] = useState();

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [tableId, setTableId] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [fields, setFields] = useState();

  const [addTable, { isLoading: addLoading }] = useAddTableMutation();
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable, { isLoading }] = useDeleteTableMutation();

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetTablesQuery({});
  const [addInvoice] = useAddInvoiceMutation();



  const [getInvoice] = useLazyGetInvoicesQuery();

  const { triggerRedirect } = useError401Admin(isError, error);



  // WebSocket listener for table updates
  useEffect(() => {
    console.log("channel");
    channel.listen(".App\\Events\\TableUpdatedEvent", (event) => {
      console.log("📩 Event received:", event);
      setTables(event);
    });
  }, [channel]);

  // Refetch data on component mount and refresh
  useEffect(() => {
    refetch();
  }, [refresh]);

  // Update tables state when data changes
  useEffect(() => {
    setTables(data);
  }, [data]);



  const handleShowEdit = (table) => {
    setShowEdit(true);
    setPassedData({
      number_table: table?.number_table,
      is_qr_table: table?.is_qr_table === 1 ? "Yes" : "No",
      id: table?.id,
    });
  };

  const handleReceipt = async (table) => {
    console.log(table)
    try {

      const result = await addInvoice({
        table_id: table?.id,
      }).unwrap();

      if (result?.message && !result?.data) {
        notify(result.message, "error");

      }

      if (result?.message && result?.data) {
        notify(result.message, "success");

      }

      console.log("Invoice API response:", result);
      if (result?.data) {

        setInvoiceData(result.data);
        handleShowReceipt(tableId);
      } else {
        // If no new invoice, use the stored one

        const res = await getInvoice({ selectedTableId: table?.id }).unwrap()
        console.log(res)
        if (res?.data?.length > 1) {
          notify("اضف طلبات أولا ", "error")
          return;
        } else {
          setInvoiceData(res?.data[0]);

          setShowInv(true);
          setPassedData({ id: tableId });
        }

      }
    } catch (err) {
      console.error("Error generating invoice:", err);
      notify(err?.data?.message, "error");
    }
  };

  const handleShowDelete = (table) => {
    setShowDelete(true);
    console.log(table)
    setPassedData(table);
  };

  const handleShowReceipt = (tableId) => {
    setShowInv(true);
    setPassedData({ id: tableId });
  };

  const handleShowDetails = (table) => {
    setShowDetails(true);
    setPassedData(table);
  };

  const handleShowOrders = (table) => {
    navigate(`/admin/tables/${table.id}/orders`);
  };

  const onPress = async (page) => {
    setPage(page);
  };

  useEffect(() => {
    const result = getAddTableFormFields();
    setFields(result);
  }, []);

  // Badge component showing table status with color coding
  const cartWithStatus = (row) => (
    <Badge
      overlap="circular"
      variant="dot"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor:
            row.new === 1 ? "rgba(255, 0, 0, 1)" : row.new === 2 ? "rgba(255, 255, 0, 1)" : row.new === 1 ? "gray" : "rgba(0, 255, 0, 1)",


        },
      }}
    >
      <BsFillCartCheckFill size={22} />
    </Badge>
  );

  // Table action buttons configuration
  const actions = [
    {
      icon: cartWithStatus,
      name: "showOrders",
      onClickFunction: handleShowOrders,
    },
    {
      icon: <FaEye />,
      name: "view",
      onClickFunction: handleShowDetails,
    },
    {
      icon: <EditOutlinedIcon />,
      name: "edit",
      onClickFunction: handleShowEdit,
    },
    {
      icon: <ReceiptIcon />,
      name: "receipt",
      onClickFunction: (table) => handleReceipt(table),
    },
    {
      icon: <DeleteIcon />,
      name: "delete",
      onClickFunction: handleShowDelete,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-content-center gap-1 my-5 ">
        <DynamicSkeleton
          count={5}
          variant="rounded"
          height={250}
          animation="wave"
          spacing={3}
          columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-wrap items-center gap-3 justify-start">
        {tables &&
          !mode &&
          tables?.data?.map((table, index) => {
            return (
              <TableCard
                key={index}
                index={index}
                onShow={(table) => handleShowDetails(table)}
                onEdit={(table) => handleShowEdit(table)}
                onDelete={(table) => handleShowDelete(table)}
                onReceipt={(table) => handleReceipt(table)}
                onAdd={() => navigate(`/admin/addOrder/${table?.id}`)}
                onClick={() => navigate(`/admin/tables/${table?.id}/orders`)}
                data={table}
              />
            );
          })}
      </div>

      {mode && (
        <Table
          columns={tableHeaders}
          data={tables?.data}
          error={error}
          isFetching={isFetching}
          fieldsToShow={fieldsToShow}
          actions={actions}
        />
      )}

      {tables?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={tables?.meta?.total_pages} />
      )}

      {/* Add Table Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={handleCloasAddTable}
        onSubmit={async (values) =>
          await onAddTableSubmit(values, addTable, handleCloasAddTable)
        }
        passedData={{}}
        show={showAddTable}
        title={"Add Table"}
      />

      {/* Edit Table Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowEdit(false)}
        onSubmit={async (values) =>
          onUpdateTableSubmit(values, passedData?.id, updateTable, () =>
            setShowEdit(false)
          )
        }
        passedData={passedData}
        show={showEdit}
        title={"Edit Table"}
      />

      {/* Table Details Modal */}
      <ShowTable
        show={showDetails}
        handleClose={() => setShowDetails(false)}
        table={passedData}
      />

      {/* Delete Confirmation Modal */}
      <AttentionModal
        handleClose={() => setShowDelete(false)}
        loading={isLoading}
        message={"Are you sure you want to delete this item?"}
        title={"Confirm Deletion"}
        onIgnore={() => setShowDelete(false)}
        onOk={async () =>
          await handleDelete(
            deleteTable,
            passedData?.id,
            () => setShowDelete(false),
            triggerRedirect
          )
        }
        show={showDelete}
      />

      {/* Invoice Display Modal */}
      <ShowInvoice
        show={showInv}
        handleClose={() => {
          setInvoiceData({});

          setShowInv(false)
        }}
        id={passedData?.id}
        from="tables"
        data={invoiceData}

      />

      <ToastContainer />
    </>
  );
};

export default TablesContainer;
