// This file manages the container responsible for rendering restaurant manager cards, handling their selection, and managing pagination.

import React, { useEffect } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import Pagination from "../../../utils/Pagination";
import RestsManagerCard from "./RestsManagerCard";
import { useSelector, useDispatch } from "react-redux";
import {
  resetStoreState,
  sotreIdRestaurantAction,
} from "../../../redux/slice/restsManager/ratesManagerSlice";
import notify from "../../../utils/useNotification";
import { getAllCategoriesAction } from "../../../redux/slice/categories/categoriesSlice";
import { useNavigate } from "react-router-dom";

/**
 * RestsManagerContainer displays a paginated list of restaurant manager cards.
 * On selecting a restaurant, it updates the Redux state and navigates to the admin home.
 *
 * @param {Object} props - Component props
 * @param {Array} props.restsManager - List of restaurants with pagination metadata
 * @param {boolean} props.loading - Loading state for restaurant data
 * @param {Function} props.setPage - Function to update the current pagination page
 *
 * @returns {JSX.Element} A visual representation of restaurant manager cards with pagination and state handling
 */
const RestsManagerContainer = ({ restsManager, loading, setPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Destructure store ID-related state from Redux
  const {
    storeIdDetails,
    loading: loadingResManager,
    error,
  } = useSelector((state) => state.restsManager.storeId);

  /**
   * Handles click on a restaurant card.
   * Sets the selected store ID and triggers fetching of categories for that restaurant.
   */
  const handleClick = async (item) => {
    if (item?.id) {
      await dispatch(sotreIdRestaurantAction(item.id));
      await dispatch(getAllCategoriesAction(1));
      await localStorage.setItem('selected', 'الأصناف');
    }
  };

  /**
   * Effect triggered when loading or error state changes.
   * If a store is successfully fetched, redirects the user and stores the new admin info.
   */
  useEffect(() => {
    if (!loadingResManager) {
      if (storeIdDetails) {
        if (storeIdDetails.status === true) {
          setTimeout(() => {
            navigate("/admin");
          }, 500);

          dispatch(resetStoreState());

          const prevData = JSON.parse(localStorage.getItem("adminInfo"));
          const updatedData = {
            ...prevData,
            restaurant_id: storeIdDetails?.data?.id,
            restaurant: storeIdDetails?.data,
          };
          localStorage.setItem("adminInfo", JSON.stringify(updatedData));
        } else {
          notify(storeIdDetails?.message, "error");
          dispatch(resetStoreState());
        }
      }

      if (error) {
        notify(error?.message, "error");
        dispatch(resetStoreState());
      }
    }
  }, [loadingResManager, error]);

  /**
   * Handles pagination click and updates the current page
   */
  const onPress = (page) => {
    setPage(page);
  };

  return (
    <div>
      <Row
        className="d-flex justify-content-center flex-wrap gap-3 gap-lg-5"
        style={{ minHeight: "" }}
      >
        {loading === false ? (
          restsManager?.data ? (
            restsManager.data.map((item) => {
              return (
                <RestsManagerCard
                  key={item.id}
                  item={item}
                  handleClick={handleClick}
                />
              );
            })
          ) : (
            <h3 className="m-auto text-center">لا يوجد بيانات</h3>
          )
        ) : (
          <Spinner className="m-auto" animation="border" variant="primary" />
        )}

        {restsManager?.meta?.total_pages > 1 && (
          <Pagination
            onPress={onPress}
            pageCount={restsManager.meta.total_pages}
          />
        )}
      </Row>
    </div>
  );
};

export default RestsManagerContainer;
