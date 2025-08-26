/**
 * This component `CitiesContainer` manages the display and interaction logic for the list of cities.
 *
 * Features:
 * - Fetching and displaying paginated city data from Redux store.
 * - Supports actions: view city restaurants, edit city, delete city, and toggle activation.
 * - Displays modals for adding, editing, deleting, or deactivating cities.
 *
 * Props:
 * @param {boolean} show - Controls the visibility of the "Add City" modal.
 * @param {function} handleClose - Function to close the "Add City" modal.
 * @param {boolean} refresh - Triggers a re-fetch of the cities list when updated.
 *
 * @returns {JSX.Element} Renders the table of cities and associated modals for CRUD operations.
 */

import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCitiesAction,
  resetStatus,
} from "../../redux/slice/super_admin/city/citySlice";
import Pagination from "../../utils/Pagination";
import Table from "../../components/Tables/Tables";
import {
  getAddCityFormFields,
  handleAddCitySubmit,
  handleDeactiveCity,
  handleDeleteCity,
  handleUpdateCitySubmit,
} from "./helper";
import DynamicForm from "../../components/Modals/AddModal/AddModal";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";

const CitiesContainer = ({ show, handleClose, refresh }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [passedData, setPassedData] = useState();
  const [fields, setFields] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const [showEditCity, setShowEditCity] = useState(false);

  const { cities, loading, error, status } = useSelector((state) => state.citySuper);

  const {
    loading: deleteLoading,
    error: deleteError,
    cityDeletedDetails,
  } = useSelector((state) => state.citySuper.deletedCity);

  const {
    loading: deactiveLoading,
    error: deactiveError,
    cityDeactiveDetails,
  } = useSelector((state) => state.citySuper.deactiveCity);

  // Table headers and fields to show
  const tableHeader = ["اسم المدينة", "الحالة", "الحدث"];
  const fieldsToShow = ["name_ar", "is_active"];

  // Fetch form fields when component mounts
  useEffect(() => {
    const res = getAddCityFormFields();
    setFields(res);
  }, []);

  // Fetch cities when page changes or refresh triggered
  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllCitiesAction(page));
    }
  }, [status, page, refresh]);

  // Reset fetch status when refresh triggered
  useEffect(() => {
    dispatch(resetStatus());
  }, [refresh]);

  // Action handlers
  const handleShowDelete = (city) => {
    setPassedData(city);
    setShowDeleteModal(true);
  };

  const handleShowDeactive = (city) => {
    setPassedData(city);
    setShowDeactiveModal(true);
  };

  const handleShowEditCity = (city) => {
    setPassedData(city);
    setShowEditCity(true);
  };

  const onPress = async (page) => {
    dispatch(resetStatus());
    setPage(page);
  };

  // Actions shown in the table row
  const actions = [
    {
      icon: <FaEye />,
      name: "view",
      onClickFunction: (city) => navigate(`/super_admin/city/${city?.id}/resturants`),
    },
    {
      icon: <EditOutlinedIcon />,
      name: "edit",
      onClickFunction: handleShowEditCity,
    },
    {
      icon: <DeleteIcon />,
      name: "delete",
      onClickFunction: handleShowDelete,
    },
    {
      icon: <BlockOutlinedIcon />,
      name: "active",
      onClickFunction: handleShowDeactive,
    },
  ];

  return (
    <>
      <Table
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        actions={actions}
        data={cities?.data}
        error={error}
        isFetching={loading}
      />

      {cities?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={cities?.meta?.total_pages} />
      )}

      {show && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={handleClose}
          onSubmit={async (values) =>
            await handleAddCitySubmit(values, dispatch, page, handleClose)
          }
          passedData={{}}
          show={show}
          title={"إضافة مدينة"}
        />
      )}

      {showEditCity && (
        <DynamicForm
          fields={fields}
          loading={false}
          onHide={() => setShowEditCity(false)}
          onSubmit={async (values) =>
            await handleUpdateCitySubmit(
              passedData?.id,
              values,
              dispatch,
              page,
              () => setShowEditCity(false)
            )
          }
          passedData={passedData}
          show={showEditCity}
          title={"تعديل مدينة"}
        />
      )}

      {showDeleteModal && (
        <AttentionModal
          title={"حذف المدينة"}
          handleClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
          message={"هل أنت متأكد من هذه العملية"}
          onIgnore={() => setShowDeleteModal(false)}
          onOk={async () =>
            await handleDeleteCity(passedData?.id, dispatch, page, () =>
              setShowDeleteModal(false)
            )
          }
          show={showDeleteModal}
        />
      )}

      {showDeactiveModal && (
        <AttentionModal
          title={passedData?.is_active === 1 ? "تعطيل المدينة" : "تنشيط المدينة"}
          handleClose={() => setShowDeactiveModal(false)}
          loading={deactiveLoading}
          message={"هل أنت متأكد من هذه العملية"}
          onIgnore={() => setShowDeactiveModal(false)}
          onOk={async () =>
            await handleDeactiveCity(
              passedData?.id,
              dispatch,
              page,
              () => setShowDeactiveModal(false),
              passedData?.is_active
            )
          }
          show={showDeactiveModal}
        />
      )}
    </>
  );
};

export default CitiesContainer;
