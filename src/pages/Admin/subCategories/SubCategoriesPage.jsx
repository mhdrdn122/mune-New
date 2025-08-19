// This file manages the admin interface for displaying and managing sub-categories within a specific main category.

import { useParams } from "react-router-dom";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubCategoriesAction,
  resetSuccess,
} from "../../../redux/slice/subCategories/subCategoriesSlice";
import { SubCategoriesContainer } from "../../../Containers/SubCategoryContainer/SubCategoriesContainer";
import { PermissionsEnum } from "../../../constant/permissions";
import { ToastContainer } from "react-toastify";
import PageHeader from "../../../components/PageHeader/PageHeader";
import DynamicForm from "../../../components/Modals/AddModal/AddModal";
import {
  getCategoryFormFields,
  handleAddCategory,
} from "../../../components/Admin/category/helpers";
import SubAppBar from "../../../utils/SubAppBar";

// Breadcrumbs array for page navigation
const breadcrumbs = [
  {
    label: "الأصناف",
    to: "/admin",
  },
  {
    label: " الأصناف الفرعية",
  },
].reverse();

/**
 * `SubCategoriesPage` is the page where all sub-categories for a given category are displayed and managed.
 * It supports fetching sub-categories, pagination, and opening a modal for adding a new sub-category.
 *
 * @returns {JSX.Element} The rendered sub-categories management page.
 */
const SubCategoriesPage = () => {
  const { id } = useParams(); // category ID from the URL
  const dispatch = useDispatch();

  const [page, setPage] = useState(1); // Pagination state
  const [showAddSubCat, setShowAddSubCat] = useState(false); // Add sub-category modal visibility
  const [refresh, setRefresh] = useState(false); // Refresh flag
  const [fields, setFields] = useState(); // Dynamic form fields

  // Prepare the form fields for adding a sub-category
  useEffect(() => {
    const result = getCategoryFormFields();
    setFields(result);
  }, []);

  const { subCategories, loading } = useSelector(
    (state) => state.subCategories
  );

  // Memoized payload to prevent unnecessary re-fetching
  const getSubCategoriesPayload = useMemo(() => ({ id, page }), [id, page]);

  // Fetch sub-categories when component mounts or when page/refresh changes
  useEffect(() => {
    /**
     * Fetches the sub-categories for the current category ID.
     */
    const getSubCats = async () => {
      await dispatch(getAllSubCategoriesAction({ id, page }));
    };

    if (!subCategories || !subCategories.length) {
      getSubCats();
      window.scrollTo(0, 0);
    }
  }, [dispatch, getSubCategoriesPayload, page, refresh]);

  // Reset success status on mount or when dependencies change
  useEffect(() => {
    dispatch(resetSuccess());
  }, [dispatch, getSubCategoriesPayload]);

   const Permission = {
      Add: PermissionsEnum.CATEGORY_ADD,
    };
  
  return (
    <Fragment>
      {/* Page heading with breadcrumbs and permission-based add button */}
      

      <SubAppBar
        title=" الأصناف الفرعية"
        showAddButton={true}
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        onAdd={() => setShowAddSubCat(true)}
        requiredPermission={Permission}
      />

      {/* Sub-categories list container */}
      <SubCategoriesContainer
        Subcategories={subCategories}
        loading={loading}
        setPage={setPage}
        page={page}
        to={`/admin/category/${id}/subCategory`}
        masterId={id}
      />

      {/* Modal for adding a new sub-category */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowAddSubCat(false)}
        show={showAddSubCat}
        onSubmit={async (values) =>
          await handleAddCategory(dispatch, values, page, true, id)
        }
        passedData={{}}
        title={"إضافة صنف جديد"}
      />

      {/* Toast notification container */}
      <ToastContainer />
    </Fragment>
  );
};

export default SubCategoriesPage;
