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
import { Pagination } from "react-bootstrap";
import useError401Admin from "../../hooks/useError401Admin";
import DynamicForm from "../../components/Modals/AddModal/AddModal";
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

const tableHeaders = ["رقم الطاولة", "الحدث"];
const fieldsToShow = ["number_table"];

/**
 * `TablesContainer` renders the table list, form modals, and related actions
 *
 * @param {boolean} showAddTable - Controls visibility of Add Table modal
 * @param {Function} handleCloasAddTable - Callback to close Add Table modal
 * @param {number} refresh - Trigger to force data reload
 * @returns {JSX.Element} The main table management container
 */
const TablesContainer = ({ showAddTable, handleCloasAddTable, refresh }) => {
  const userData = JSON.parse(localStorage.getItem("adminInfo"));
  const navigate = useNavigate();
  const channel = useWebSocket(userData?.restaurant_id);

  const [page, setPage] = useState(1);
  const [tables, setTables] = useState();
  const [passedData, setPassedData] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
  } = useGetTablesQuery({ page });

  const { triggerRedirect } = useError401Admin(isError, error);

  useEffect(() => {
    console.log(channel)
    channel.listen(".App\\Events\\TableUpdatedEvent", (event) => {
      console.log("📩 Event received:", event);
      setTables(event);
    });
  }, [channel]);

  useEffect(()=>{refetch()},[])
  useEffect(() => {
    setTables(data);
  }, [data]);

  const handleShowEdit = (table) => {
    setShowEdit(true);
    setPassedData({
      number_table: table?.number_table,
      is_qr_table: table?.is_qr_table === 1 ? "نعم" : "لا",
      id: table?.id,
    });
  };

  const handleShowDelete = (table) => {
    setShowDelete(true);
    setPassedData(table);
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

  const [fields, setFields] = useState();
  useEffect(() => {
    const result = getAddTableFormFields();
    setFields(result);
  }, []);
  console.log("tables=" , tables)

  const cartWithStatus = (row) => (
    <Badge
      overlap="circular"
      variant="dot"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiBadge-badge": {
          // 1 → red, 2 → yellow, 3 → green
          backgroundColor:
            row.new === 1
              ? "red"
              : row.new === 2
              ? "yellow"
              : "green",
        },
      }}
    >
      <BsFillCartCheckFill size={22} />
    </Badge>
  );

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
      icon: <DeleteIcon />,
      name: "delete",
      onClickFunction: handleShowDelete,
    },
  ];

  return (
    <>
      <Table
        columns={tableHeaders}
        data={tables?.data}
        error={error}
        isFetching={isFetching}
        fieldsToShow={fieldsToShow}
        actions={actions}
      />
      {tables?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={tables?.meta?.total_pages} />
      )}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={handleCloasAddTable}
        onSubmit={async (values) =>
          await onAddTableSubmit(values, addTable, handleCloasAddTable)
        }
        passedData={{}}
        show={showAddTable}
        title={"إضافة طاولة"}
      />
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowEdit(false)}
        onSubmit={async (values) =>
          onUpdateTableSubmit(
            values,
            passedData?.id,
            updateTable,
            () => setShowEdit(false)
          )
        }
        passedData={passedData}
        show={showEdit}
        title={"تعديل طاولة"}
      />
      <ShowTable
        show={showDetails}
        handleClose={() => setShowDetails(false)}
        table={passedData}
      />
      <AttentionModal
        handleClose={() => setShowDelete(false)}
        loading={isLoading}
        message={"هل انت متأكد من حذف هذا العنصر؟"}
        title={"تأكيد عملية الحذف"}
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
      <ToastContainer />
    </>
  );
};

export default TablesContainer;
