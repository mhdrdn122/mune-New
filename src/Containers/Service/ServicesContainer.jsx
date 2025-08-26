// This component handles rendering, editing, adding, and deleting services within the admin panel.

import { useEffect, useState } from "react";
import {
  useAddServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from "../../redux/slice/service/serviceApi";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import useError401Admin from "../../hooks/useError401Admin";
import Pagination from "../../utils/Pagination";
import Table from "../../components/Tables/Tables";
import {
  getAddServiceFormFields,
  handleAddService,
  handleDeleteService,
  handleUpdateService,
} from "./helpers";
import DynamicForm from "../../components/Modals/AddModal/AddModal";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";

/**
 * `ServicesContainer` is responsible for managing the list of services.
 * It provides functionality to add, edit, and delete services, and renders a paginated table.
 *
 * @param {boolean} show - Controls the visibility of the "Add Service" modal.
 * @param {Function} handleClose - Function to close the "Add Service" modal.
 * @param {number} refresh - A number to trigger re-fetching of services.
 * @returns {JSX.Element} The services management section.
 */
const ServicesContainer = ({ show, handleClose, refresh }) => {
  const tableHeader = ["الخدمة", "السعر", "الحدث"];
  const fieldsToShow = ["name_ar", "price"];

  const [passedData, setPassedData] = useState(); // Holds data for edit/delete
  const [fields, setFields] = useState(); // Form fields for dynamic form
  const [page, setPage] = useState(1); // Pagination page
  const [showDelete, setShowDelete] = useState(false); // Delete modal visibility
  const [showEdit, setShowEdit] = useState(false); // Edit modal visibility

  const [addService] = useAddServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading }] = useDeleteServiceMutation();

  const {
    data: services,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetServicesQuery({ page, refresh });

  const { triggerRedirect } = useError401Admin(isError, error);

  // Initialize form fields once when the component is mounted
  useEffect(() => {
    const res = getAddServiceFormFields();
    setFields(res);
  }, []);

  // Show edit modal and pass the selected item
  const handleShowEdit = (item) => {
    setPassedData(item);
    setShowEdit(true);
  };

  // Show delete modal and pass the selected item
  const handleShowDelete = (item) => {
    setPassedData(item);
    setShowDelete(true);
  };

  // Handle pagination
  const onPress = async (page) => {
    setPage(page);
  };

  // Define actions for table (edit & delete)
  const actions = [
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
        actions={actions}
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        data={services?.data}
        isFetching={isFetching}
        error={error}
      />

      {services?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={services?.meta?.total_pages} />
      )}

      {/* Add Service Modal */}
      {show && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={handleClose}
          show={show}
          onSubmit={async (values) =>
            await handleAddService(values, handleClose, addService)
          }
          passedData={{}}
          title={"إضافة خدمة"}
        />
      )}

      {/* Edit Service Modal */}
      {showEdit && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={() => setShowEdit(false)}
          show={showEdit}
          onSubmit={async (values) =>
            await handleUpdateService(
              { id: passedData?.id, ...values },
              handleClose,
              updateService
            )
          }
          passedData={passedData}
          title={"تعديل خدمة"}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <AttentionModal
          handleClose={() => setShowDelete(false)}
          loading={isLoading}
          message={"هل أنت متأكد من عملية الحذف؟"}
          title={"حذف الخدمة"}
          onIgnore={() => setShowDelete(false)}
          onOk={async () =>
            await handleDeleteService(
              passedData?.id,
              deleteService,
              () => setShowDelete(false),
              triggerRedirect
            )
          }
          show={showDelete}
        />
      )}
    </>
  );
};

export default ServicesContainer;
