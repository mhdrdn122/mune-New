import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRandomNumber from "../../hooks/useRandomNumber";
import {
  getAddEmplyeeFields,
  getAddMutation,
  getDeactivateEmployee,
  getDeleteEmployee,
  getEditEmployeeMutation,
  getEmployee,
  getTypes,
  handleDeactiveEmployee,
  handleDeleteEmployee,
} from "./helpers";

import Table from "../../components/Tables/Tables";
import Pagination from "../../utils/Pagination";
import ShowAdmin from "../../components/Admin/admins/ShowAdmin";
import DynamicForm from "../../components/Modals/AddModal/AddModal";
import AttentionModal from "../../components/Modals/AttentionModal/AttentionModal";

import { ToastContainer } from "react-toastify";
import { FaEdit, FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import notify from "../../utils/useNotification";
import useError401Admin from "../../hooks/useError401Admin";
import DynamicCard from "../../utils/DynamicCard";
import { PermissionsEnum } from "../../constant/permissions";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";
import { useGetPermissonsQuery } from "../../redux/slice/admins/adminsApi";

/**
 * EmployeesContainer Component
 *
 * Displays a filtered, paginated list of employees with support for:
 * - Viewing employee details
 * - Adding, editing, deleting, and deactivating employees
 * - Dynamic form fields and role-based permissions
 *
 * @param {Object} props
 * @param {boolean} props.showForm - Whether the add employee form should be shown
 * @param {Function} props.handleClose - Function to close the modal
 * @param {number|string} props.refresh - Trigger refresh using this signal
 * @param {string} props.role - Role filter
 * @param {string} props.startDate - Filter by creation date start
 * @param {string} props.endDate - Filter by creation date end
 * @param {boolean} props.isSuperAdmin - Super admin flag to control API permissions
 */
const EmployeesContainer = ({
  showForm,
  handleClose,
  refresh,
  role,
  startDate,
  endDate,
  isSuperAdmin,
  mode,
}) => {
  const { resId } = useParams(); // Restaurant ID from route
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);

   const { data: permissions } = useGetPermissonsQuery(undefined);
  const [loadingFields, setLoadingFields] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false); // Check if an admin user exists

  console.log(permissions)
  // Fetch employees
  const {
    data: employees,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = getEmployee(
    isSuperAdmin,
    role,
    1,
    refresh,
    startDate,
    endDate,
    resId,
    randomNumber
  );

  useEffect(() => {
    if (employees) {
      const value = employees?.data?.some((obj) => obj.roles === "أدمن");
      setHasAdmin(value);
    }
  }, [employees]);

  // Define headers and visible fields in the employee table
  const tableHeaders = [
    "الاسم",
    "رقم الموبايل",
    "الدور",
    "عدد الموافقات",
    "متوسط زمن الاستجابة",
    "الحالة",
    "الحدث",
  ];
  const fieldsToShow = ["name", "mobile", "type", "number", "avg", "is_active"];

  // Modal and state handling
  const [showEmployee, setShowEmployee] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeactivate, setShowDeactive] = useState(false);
  const [passedData, setPassedData] = useState(null);

  // Modal control functions
  const handleShowEmployee = (data) => {
    setShowEmployee(true);
    setPassedData(data);
  };
  const handleShowEdit = (data) => {
    setShowEdit(true);
    console.log(data)
     setPassedData(data);
  };
  const handleShowDelete = (data) => {
    setShowDelete(true);
    setPassedData(data);
  };
  const handleShowDeactive = (data) => {
    setShowDeactive(true);
    setPassedData(data);
  };

  const actions = [
    { icon: <FaEye />, name: "view", onClickFunction: handleShowEmployee },
    {
      icon: <EditOutlinedIcon />,
      name: "edit",
      onClickFunction: handleShowEdit,
    },
    {
      icon: <DeleteIcon />,
      delete: "delete",
      onClickFunction: handleShowDelete,
    },
    {
      icon: <BlockOutlinedIcon />,
      name: "active",
      onClickFunction: handleShowDeactive,
    },
  ];

  const { triggerRedirect } = useError401Admin(isError, error);

  // API hooks
  const [deleteEmployee, { isLoading }] = getDeleteEmployee(isSuperAdmin);
  const [deactivateEmployee, { isLoading: loadingDeactive }] =
    getDeactivateEmployee(isSuperAdmin);
  const [fields, setFields] = useState();

  const [
    addEmployee,
    { isLoading: isLoadingAdd, isSuccess, isError: addErr, error: errorAdd },
  ] = getAddMutation(isSuperAdmin);
  const [updateEmployee] = getEditEmployeeMutation(isSuperAdmin);

  const formatEmployeeData = (formValues, isEditMode = false) => {
  const types = JSON.parse(localStorage.getItem("types"));
  const type_id = types?.find((item) => item.name === formValues.type_id)?.id;
  const categories = formValues?.category?.map((item) => item.id);
  const permission = formValues?.permission?.map((item) => item.name);

  let body = {
    name: formValues.name,
    user_name: formValues.user_name,
    mobile: formValues.mobile,
    role: formValues.role,
    type_id,
    'permission[]': permission,
    'category[]': categories,
  };

  if (isEditMode) {
    body.id = formValues.id;
  }
  
  // قم بإضافة حقل 'password' فقط إذا كان موجودًا في formValues
  if (formValues.password) {
    body.password = formValues.password;
  }

  // معالجة حالة الأدمن
  if (formValues.role === "أدمن") {
    body = {
      name: formValues.name,
      user_name: formValues.user_name,
      password: formValues.password,
      mobile: formValues.mobile,
      restaurant_id: resId, // تأكد من أن resId متاح في النطاق (scope)
      role: formValues.role,
      'category[]': formValues.category,
    };
  }

  return body;
};
/**
 * Submit handler for adding a new employee.
 * It formats form values into a FormData object for submission.
 *
 * @param {object} formValues - The form data submitted by the user.
 */
const onAddEmployee = async (formValues) => {
  const types = JSON.parse(localStorage.getItem("types"));
  const type_id = types?.find((item) => item.name === formValues.type_id)?.id;

  // Create a new FormData object to handle key-value pairs,
  // allowing for multiple values with the same key.
  const formData = new FormData();

  // Append basic employee data
  formData.append('name', formValues.name);
  formData.append('user_name', formValues.user_name);
  formData.append('mobile', formValues.mobile);
  formData.append('role', formValues.role);

  // Conditionally append password if it exists
  if (formValues.password) {
    formData.append('password', formValues.password);
  }

  // Handle the 'admin' role differently
  if (formValues.role === "أدمن") {
    formData.append('restaurant_id', resId);
    // Append each category item separately
    if (formValues.category) {
      formValues.category.forEach(item => {
        formData.append('category[]', item);
      });
    }
  } else {
    // For non-admin roles, append type_id and formatted arrays
    formData.append('type_id', type_id);
    
    // Append each category item separately
    const categories = formValues?.category?.map((item) => item.id);
    if (categories && categories.length > 0) {
      categories.forEach(item => {
        formData.append('category[]', item);
      });
    }

    // Append each permission item separately
    const permission = formValues?.permission?.map((item) => item.name);
    if (permission && permission.length > 0) {
      permission.forEach(item => {
        formData.append('permission[]', item);
      });
    }
  }

  const result = await addEmployee(formData).unwrap();
  return result;
};

 /**
 * Submit handler for editing an existing employee.
 * It formats form values into a FormData object for submission.
 *
 * @param {object} formValues - The form data submitted by the user.
 */
const onEditEmployee = async (formValues) => {
  const types = JSON.parse(localStorage.getItem("types"));
  const type_id = types?.find((item) => item.name === formValues.type_id)?.id;

  // Create a new FormData object
  const formData = new FormData();

  // Append employee data, including the ID
  formData.append('id', passedData.id);
  formData.append('name', formValues.name);
  formData.append('user_name', formValues.user_name);
  formData.append('mobile', formValues.mobile);
  formData.append('role', formValues.role);
  formData.append('type_id', type_id);

  // Conditionally append password if it exists
  if (formValues.password) {
    formData.append('password', formValues.password);
  }

  // Append each category item separately
  const categories = formValues.category.map((item) => item.id);
  if (categories && categories.length > 0) {
    categories.forEach(item => {
      formData.append('category[]', item);
    });
  }

  // Append each permission item separately
  const permission = formValues?.permission?.map((item) => item.name);
  if (permission && permission.length > 0) {
    permission.forEach(item => {
      formData.append('permission[]', item);
    });
  }

  const result = await updateEmployee(formData).unwrap();
  if (result.status === true) {
    notify(result.message, "success");
    handleClose();
  }
};

  // Fetch and cache types
  const { data: types } = getTypes(isSuperAdmin);
  useEffect(() => {
    if (types) {
      localStorage.setItem("types", JSON.stringify(types.data));
    }
  }, [types]);

  // Fetch dynamic form fields for add/edit
  useEffect(() => {
    (async () => {
      const types = localStorage.getItem("types");
      setLoadingFields(true);
      const res = await getAddEmplyeeFields(
        isSuperAdmin,
        hasAdmin,
        JSON.parse(types),
        showEdit ? "edit" : "add",
        permissions
      );
      setFields(res);
      setLoadingFields(false);
    })();
  }, [types, showEdit, showForm]);

    if (loading) {
    return (
      <div className="flex justify-content-center gap-1 my-5 ">
        <DynamicSkeleton
          count={5}
          variant="rounded"
          height={250}
          animation="wave"
          spacing={3}
          columns={{ xs: 12, sm: 6, md: 6, lg: 4 }}
        />
      </div>
    );
  }
  return (
    <div>
      <div className="w-full flex flex-wrap items-center gap-3 justify-center">
        {employees &&
          !mode &&
          employees?.data?.map((emp, index) => {
            return (
              <DynamicCard
                key={emp.id}
                data={emp}
                showActionTitle={true}
                titleKey={`الموظف  ${index + 1}`}
                fields={[
                  { key: "name", label: "الاسم" },
                  { key: "mobile", label: "رقم الموبايل" },
                  { key: "number", label: "عدد الموافقات" },
                  { key: "avg", label: "  متوسط زمن الاستجابة " },
                  {
                    key: "is_active",
                    label: "الحالة",
                    format: (value) => (value == 1 ? "نشط" : "غير نشط"),
                  },
                ]}
                actions={[
                  {
                    name: "view",
                    icon: <FaEye fontSize="large" />,
                    permission: PermissionsEnum.USER_ADD,
                  },

                  {
                    name: "edit",
                    icon: <FaEdit fontSize="large" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                  {
                    name: "delete",
                    icon: <DeleteIcon fontSize="small" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                  {
                    name: "active",
                    icon: <BlockOutlinedIcon fontSize="small" />,
                    permission: PermissionsEnum.USER_ADD,
                  },
                ]}
                onAction={(action, userData) => {
                  switch (action) {
                    case "view":
                      handleShowEmployee(userData);
                      break;

                    case "edit":
                      handleShowEdit(userData);
                      break;
                    case "delete":
                      handleShowDelete(userData);
                      break;
                    case "active":
                      handleShowDeactive(userData);
                      break;
                    default:
                      break;
                  }
                }}
              />
            );
          })}
      </div>

      {!(employees?.data?.length > 0) && !mode && (
        <p className="fw-bold text-center text-[#2F4B26]">لا توجد بيانات</p>
      )}
      {/* Employee Table */}
      {employees?.data && mode && (
        <Table
          columns={tableHeaders}
          data={employees?.data}
          error={error}
          isFetching={isFetching}
          fieldsToShow={fieldsToShow}
          actions={actions}
        />
      )}

      {/* Pagination */}
      {employees?.meta?.total_pages > 1 && (
        <Pagination
          onPress={onPress}
          pageCount={employees?.meta?.total_pages}
        />
      )}

      {/* View Modal */}
      <ShowAdmin
        show={showEmployee}
        handleClose={() => setShowEmployee(false)}
        data={passedData}
      />

      {/* Edit Modal */}
      <DynamicForm
        fields={fields}
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onSubmit={onEditEmployee}
        title={"تعديل موظف"}
        isLoading={loadingFields}
        passedData={passedData}
      />

      {/* Delete Confirmation Modal */}
      <AttentionModal
        handleClose={() => setShowDelete(false)}
        loading={isLoading}
        message={"هل أنت متأكد من عمليةالحذف"}
        title={"حذف الموظف"}
        onIgnore={() => setShowDelete(false)}
        onOk={async () =>
          await handleDeleteEmployee(
            passedData?.id,
            deleteEmployee,
            () => setShowDelete(false),
            triggerRedirect
          )
        }
        show={showDelete}
      />

      {/* Deactivate Confirmation Modal */}
      <AttentionModal
        handleClose={() => setShowDeactive(false)}
        loading={loadingDeactive}
        message={"هل أنت متأكد من هذه العملية"}
        title={
          passedData?.is_active
            ? "تأكيد عملية إلغاء التنشيط"
            : "تأكيد عملية التنشيط"
        }
        onIgnore={() => setShowDeactive(false)}
        onOk={async () =>
          await handleDeactiveEmployee(
            passedData?.id,
            deactivateEmployee,
            () => setShowDeactive(false),
            triggerRedirect
          )
        }
        show={showDeactivate}
      />

      {/* Add Employee Modal */}
      {showForm && (
        <DynamicForm
          fields={fields}
          show={showForm}
          onHide={handleClose}
          onSubmit={onAddEmployee}
          title={"إضافة موظف"}
          isLoading={loadingFields}
          passedData={{}}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default EmployeesContainer;
