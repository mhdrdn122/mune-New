/**
 * File: HomePage.js
 * Description:
 * - This file manages the main admin interface for viewing and managing categories.
 * - It includes permission-based access to add categories, fetches all categories, and uses a dynamic form for adding new entries.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategoriesAction,
  resetSuccess,
} from "../../../redux/slice/categories/categoriesSlice";
import { PermissionsEnum } from "../../../constant/permissions";
import { CategoriesContainer } from "../../../Containers/CategoryContainer/CategoryContainer";
import {
  getCategoryFormFields,
  handleAddCategory,
} from "../../../components/Admin/category/helpers";
import DynamicForm from "../../../components/Modals/AddModal/AddModal";
import PageHeader from "../../../components/PageHeader/PageHeader";
import SubAppBar from "../../../utils/SubAppBar";

// Breadcrumb navigation items (reversed for RTL display)
const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/admin",
  },
  {
    label: "الأصناف",
  },
].reverse();

/**
 * HomePage Component
 * - Displays a list of categories.
 * - Provides a button and modal form to add new categories.
 * - Handles fetching and paginating categories.
 */
const HomePage = () => {
  const dispatch = useDispatch();
  const [showAddCat, setShowAddCat] = useState(false); // Modal toggle state
  const [page, setPage] = useState(1); // Pagination state
  const [refresh, setRefresh] = useState(false); // Trigger for refreshing category list
  const [fields, setFields] = useState(); // Form fields for dynamic form

  // Get and set form fields dynamically on mount
  useEffect(() => {
    const result = getCategoryFormFields();
    setFields(result);
  }, []);

  // Get Redux state for categories
  const { categories, loading, error, success } = useSelector(
    (state) => state.categories
  );

  /**
   * Fetch all categories if not already successfully loaded.
   * This function is triggered whenever `page` or `refresh` changes.
   */
  useEffect(() => {
    const getCat = async () => {
      await dispatch(getAllCategoriesAction(page));
    };
    if (!success) {
      getCat();
    }
    window.scrollTo(0, 0);
  }, [page, refresh]);

  const Permission = {
    Add: PermissionsEnum.CATEGORY_ADD,
  };

  return (
    <div className="">
      {/* Display error alert if loading fails */}
      {error && (
        <div
          className="alert alert-danger"
          style={{ textAlign: " left" }}
          role="alert"
        >
          {error.message}
        </div>
      )}
      <SubAppBar
        title="الأصناف"
        showAddButton={true}
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        onAdd={() => setShowAddCat(true)}
        requiredPermission={Permission}
      />

      {/* Category List Container */}
      <CategoriesContainer
        categories={categories}
        loading={loading}
        setPage={setPage}
        page={page}
        to={"/category"}
      />

      {/* Modal for adding a new category using a dynamic form */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowAddCat(false)}
        show={showAddCat}
        onSubmit={async (values) =>
          await handleAddCategory(dispatch, values, page)
        }
        passedData={{}}
        title={"إضافة صنف جديد"}
      />
    </div>
  );
};

export default HomePage;
