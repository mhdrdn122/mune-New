import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdsAction } from "../../../redux/slice/ads/adsSlice";
import { PermissionsEnum } from "../../../constant/permissions";

import PageHeader from "../../../components/PageHeader/PageHeader";
import AdsContainer from "../../../Containers/AdsContainer/AdsContainer";
import {
  getAdvFormField,
  handleSubmitForm,
} from "../../../components/Admin/ads/helpers";
import DynamicForm from "../../../components/Modals/AddModal/AddModal";
import { ToastContainer } from "react-toastify";
import SubAppBar from "../../../utils/SubAppBar";
import DynamicSkeleton from "../../../utils/DynamicSkeletonProps";

/**
 * AdsPage Component
 *
 * Displays and manages a paginated list of ads with the ability to:
 * - View all advertisements
 * - Add new advertisements using a dynamic form
 * - Refresh the list with pagination
 *
 * Permissions are applied to restrict who can add advertisements.
 */
const AdsPage = () => {
  const dispatch = useDispatch();

  // Local state
  const [showAddAdv, setShowAddAdv] = useState(false); // Toggle modal visibility
  const [page, setPage] = useState(1); // Current pagination page
  const [refresh, setRefresh] = useState(false); // Refresh trigger
  const [fields, setFields] = useState(); // Form fields for Add Advertisement

  // Redux state from ads slice
  const { ads, loading, error, success } = useSelector((state) => state.ads);

  /**
   * Load advertisement form fields on initial render.
   */
  useEffect(() => {
    const result = getAdvFormField();
    setFields(result);
  }, []);

  /**
   * Fetch ads from the server based on current page and refresh state.
   */
  const getAds = useCallback(async () => {
    if (!loading) {
      await dispatch(getAllAdsAction(page));
    }
  }, [dispatch, page, loading, refresh]);

  /**
   * Trigger ad fetching when page or refresh changes.
   */
  useEffect(() => {
    getAds();
  }, [page, refresh]);

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
      <SubAppBar
        title=" الإعلانات "
        showAddButton={true}
        onAdd={() => setShowAddAdv(true)}
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        requiredPermission={{
          Add: PermissionsEnum.USER_ADD,
        }}
      />

      {/* List of advertisements */}
      <AdsContainer
        ads={ads}
        loading={loading}
        setPage={setPage}
        page={page}
        refresh={refresh}
      />

      {/* Add Advertisement Form Modal */}
      <DynamicForm
        fields={fields}
        loading={false}
        onHide={() => setShowAddAdv(false)}
        onSubmit={async (values) =>
          handleSubmitForm("add", values, undefined, dispatch, page)
        }
        passedData={{}}
        show={showAddAdv}
        title={"إضافة إعلان"}
      />
      <ToastContainer />
    </div>
  );
};

export default AdsPage;
