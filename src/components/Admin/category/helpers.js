/**
 * File: helpers.js
 * Description:
 * - Contains utility functions to handle category and subcategory operations in the admin panel:
 *   • Create (Add)
 *   • Update
 *   • Delete
 *   • Activate / Deactivate
 *   • Get Form Fields
 * 
 * These functions interact with the Redux actions and trigger UI notifications.
 */

import {
  addNewCategoryAction,
  deactiveCategoryAction,
  deleteCategoryAction,
  getAllCategoriesAction,
  resetCategoryState,
  resetDeactiveCategory,
  resetDeletedCategory,
  resetUpdatedCategory,
  updateCategoryAction,
} from "../../../redux/slice/categories/categoriesSlice";

import {
  addNewSubCategoryAction,
  deactiveSubCategoryAction,
  deleteSubCategoryAction,
  getAllSubCategoriesAction,
  resetAddSubCategory,
  resetDeactiveSubCategory,
  resetDeletedSubCategory,
  resetUpdatedSubCategory,
  updateSubCategoryAction,
} from "../../../redux/slice/subCategories/subCategoriesSlice";

import notify from "../../../utils/useNotification";

/**
 * Delete a category or subcategory by ID
 */
export const handleDelete = async (id, dispatch, page, handleClose, isSub, parentCategory) => {
  let response;
  try {
    if (!isSub) {
      response = await dispatch(deleteCategoryAction(id)).unwrap();
    } else {
      response = await dispatch(deleteSubCategoryAction({ id, parentCategory }));
    }

    if (response.status === true || response.status === 200 || response.payload?.status === true) {
      notify("تم الحذف بنجاح", "success");
      handleClose();
      if (!isSub) {
        await dispatch(getAllCategoriesAction(page));
      } else {
        await dispatch(getAllSubCategoriesAction({ id: parentCategory, page }));
      }
    } else {
      notify("فشلت عملية الحذف", "error");
    }
  } catch (error) {
    console.error("Delete error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    if (!isSub) {
      await dispatch(resetDeletedCategory());
    } else {
      await dispatch(resetDeletedSubCategory());
    }
  }
};

/**
 * Activate or deactivate a category or subcategory
 */
export const handleDeactivate = async (id, dispatch, page, handleClose, is_active, isSub, parentCategory) => {
  let response;
  try {
    if (!isSub) {
      response = await dispatch(deactiveCategoryAction(id));
    } else {
      response = await dispatch(deactiveSubCategoryAction({ id, parentCategory }));
    }

    if (response.payload?.status === true) {
      const message = is_active ? "تم الغاء التنشيط بنجاح" : "تم التنشيط بنجاح";
      notify(message, "success");
      handleClose();
      if (!isSub) {
        await dispatch(getAllCategoriesAction(page));
      } else {
        await dispatch(getAllSubCategoriesAction({ id: parentCategory, page }));
      }
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    console.error("Deactivate error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    if (!isSub) {
      await dispatch(resetDeactiveCategory());
    } else {
      await dispatch(resetDeactiveSubCategory());
    }
  }
};

/**
 * Returns the form fields used for adding or editing a category
 */
export const getCategoryFormFields = () => {
  const fields = [
    { name: "image", label: "إختر صورة", type: "image", requierd: true },
    { name: "name_ar", label: "الإسم باللغة العربية", type: "text", required: true, dir: "rtl" },
    { name: "name_en", label: "الإسم باللغة الثانوية", type: "text", required: true },
  ];
  return fields;
};

/**
 * Update category or subcategory
 */
export const handleUpdateCategory = async (id, dispatch, values, page, isSub, parentCategory) => {
  let body;

  if (!isSub) {
    body = { ...values, id };
  } else {
    body = { ...values, id, category_id: parentCategory };
  }

  if (typeof body.image === "string") {
    body = { ...body, image: "" }; // Prevent sending unchanged image
  }

  let response;
  try {
    if (!isSub) {
      response = await dispatch(updateCategoryAction({ data: body }));
    } else {
      response = await dispatch(updateSubCategoryAction({ data: body, id }));
    }

    if (response.payload?.status === true) {
      notify("تم التحديث بنجاح", "success");
      if (!isSub) {
        await dispatch(getAllCategoriesAction(page));
      } else {
        await dispatch(getAllSubCategoriesAction({ id: parentCategory, page }));
      }
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    console.error("Update error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    if (!isSub) {
      await dispatch(resetUpdatedCategory());
    } else {
      await dispatch(resetUpdatedSubCategory());
    }
  }
};

/**
 * Add a new category or subcategory
 */
export const handleAddCategory = async (dispatch, values, page, isSub, parentCategory) => {
  let response;
  let body;

  if (isSub) {
    body = { ...values, category_id: parentCategory };
  }

  try {
    if (!isSub) {
      response = await dispatch(addNewCategoryAction(values));
    } else {
      response = await dispatch(addNewSubCategoryAction({ data: body }));
    }

    if (response.payload?.status === true) {
      notify("تم الإضافة بنجاح", "success");
      if (!isSub) {
        await dispatch(getAllCategoriesAction(page));
      } else {
        await dispatch(getAllSubCategoriesAction({ id: parentCategory, page }));
      }
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    console.error("Add error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    if (!isSub) {
      await dispatch(resetCategoryState());
    } else {
      await dispatch(resetAddSubCategory());
    }
  }
};
