import {
  useAddNewAdminMutation,
  useDeactivateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useGetTypesQuery,
  useUpdateAdminMutation
} from "../../redux/slice/admins/adminsApi";

import {
  get_All_Categories_and_sub
} from "../../redux/slice/categories/categoriesSlice";

import {
  useAddRestAdminMutation,
  useDeactivateRestAdminMutation,
  useDeleteRestAdminMutation,
  useGetRestAdminsQuery,
  useGetSuperTypesQuery,
  useUpdateRestAdminMutation
} from "../../redux/slice/super_admin/resAdmins/resAdminsApi";

import notify from "../../utils/useNotification";

/**
 * Returns the appropriate employee query based on admin type.
 * - Super Admin: gets restaurant-specific admins.
 * - Regular Admin: gets own system admins.
 *
 * @param {boolean} isSuperAdmin
 * @param {string} role
 * @param {number} page
 * @param {any} refresh
 * @param {string} startDate
 * @param {string} endDate
 * @param {string|number} resId
 * @param {number} randomNumber
 * @returns API hook result (RTK Query)
 */
export const getEmployee = (isSuperAdmin, role, page, refresh, startDate, endDate, resId, randomNumber) => {
  if (!isSuperAdmin)
    return useGetAdminsQuery({ type_id:role, page, refresh, startDate, endDate });
  else
    return useGetRestAdminsQuery({ page, resId, randomNumber });
};

/**
 * Dynamically builds the fields for the Add/Edit Employee form.
 *
 * @param {boolean} isSuperAdmin
 * @param {boolean} hasAdmin - Whether an admin already exists (limits role options)
 * @param {Array} types - Available employee types (e.g., waiter, cook)
 * @param {'add'|'edit'} mode - Current mode of the form
 * @returns {Array} Array of field configs
 */
export const getAddEmplyeeFields = async (isSuperAdmin, hasAdmin, types, mode , permissions) => {
  const res = await get_All_Categories_and_sub();
  const categories = res?.data?.map((category) => ({
    name: category.name,
    id: category.id
  }));

   

 

  const roles = (!isSuperAdmin || hasAdmin)
    ? ['موظف']
    : ['موظف', 'أدمن'];

  const typesLabels = types?.map((type) => type.name);

  return [
  { name: "name", label: "الإسم", type: "text", required: true },
  { name: "user_name", label: "اسم المستخدم", type: "text", required: true },
  { name: "email", label: "البريد الالكتروني", type: "text", required: true },

  { name: "password", label: "كلمة السر", type: "password", required: mode !== 'edit' },

  { name: "mobile", label: "رقم الموبايل", type: "tel", required: true },
  
  {
    name: "category",
    label: "Category",
    type: "multiselect",
    options: categories,
     isHidden: (values) => values.type_id !== "شيف"
  },
  
  {
    name: "type_id",
    label: "النوع",
    type: "select",
    options: typesLabels,
    required: true,
    isHidden: (values) => values.role === "أدمن"
  },
  
  {
    name: "permission",
    label: "الصلاحيات",
    type: "multiselect",
    options: permissions,
    isHidden: (values) => values.role === "أدمن"
  },
];
};

/**
 * Returns the types list query hook based on admin level.
 * - Super Admin: global types
 * - Regular Admin: restaurant-local types
 */
export const getTypes = (isSuperAdmin) => {
  return isSuperAdmin
    ? useGetSuperTypesQuery(undefined)
    : useGetTypesQuery(undefined);
};

/**
 * Returns appropriate mutation hook for adding an employee.
 */
export const getAddMutation = (isSuperAdmin) => {
  return isSuperAdmin
    ? useAddRestAdminMutation()
    : useAddNewAdminMutation();
};

/**
 * Returns appropriate mutation hook for editing an employee.
 */
export const getEditEmployeeMutation = (isSuperAdmin) => {
  return isSuperAdmin
    ? useUpdateRestAdminMutation()
    : useUpdateAdminMutation();
};

/**
 * Returns appropriate mutation hook for deleting an employee.
 */
export const getDeleteEmployee = (isSuperAdmin) => {
  return isSuperAdmin
    ? useDeleteRestAdminMutation()
    : useDeleteAdminMutation();
};

/**
 * Returns appropriate mutation hook for activating/deactivating an employee.
 */
export const getDeactivateEmployee = (isSuperAdmin) => {
  return isSuperAdmin
    ? useDeactivateRestAdminMutation()
    : useDeactivateAdminMutation();
};

/**
 * Deletes an employee and handles feedback/redirect.
 *
 * @param {number} id - Employee ID
 * @param {Function} deleteEmployee - Mutation hook
 * @param {Function} handleClose - Function to close modal
 * @param {Function} triggerRedirect - Function to redirect on 401 error
 */
export const handleDeleteEmployee = async (id, deleteEmployee, handleClose, triggerRedirect) => {
  try {
    const result = await deleteEmployee(id).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      triggerRedirect();
    } else {
      console.error("Failed to delete employee:", error);
      notify(error?.data?.message || "حدث خطأ أثناء الحذف", "error");
    }
  }
};

/**
 * Toggles employee active/inactive status with confirmation.
 *
 * @param {number} id - Employee ID
 * @param {Function} deactivateEmployee - Mutation hook
 * @param {Function} handleClose - Function to close modal
 * @param {Function} triggerRedirect - Function to redirect on 401 error
 */
export const handleDeactiveEmployee = async (id, deactivateEmployee, handleClose, triggerRedirect) => {
  try {
    const result = await deactivateEmployee(id).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      triggerRedirect();
    } else {
      console.error("Failed to update active status:", error);
      notify(error?.data?.message || "حدث خطأ أثناء التحديث", "error");
    }
  }
};
