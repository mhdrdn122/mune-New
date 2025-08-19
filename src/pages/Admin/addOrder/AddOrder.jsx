import { useEffect, useState } from 'react';
import { baseURLLocalPublic } from '../../../Api/baseURLLocal';
import { ToastContainer } from 'react-toastify';
import { FaCartShopping } from "react-icons/fa6";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Cart from '../../../components/Modals/CartModal/Cart';
import ItemAccordion from '../../../components/Admin/addOrder/ItemAccordion';

/**
 * AddOrder Component
 * Allows admin to view categories, subcategories, and items,
 * customize them with options (size, toppings, etc.), and add them to a cart.
 */
const AddOrder = () => {
  const [cart, setCart] = useState([]); // Items in the current order
  const [tables, setTables] = useState([]); // Restaurant tables (for selecting a table for the order)
  const [showCart, setShowCart] = useState(false); // Boolean to show/hide the cart modal
  const [loading, setLoading] = useState(false); // Loading indicator
  const [data, setData] = useState([]); // Category, subcategory, and item data
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo")); // Admin details from localStorage

  /**
   * Fetch the list of restaurant tables.
   * Tables are required to assign orders to a specific table.
   */
  const getTables = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURLLocalPublic}/admin_api/show_tables`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });
      const result = await response.json();
      if (result.status === true) {
        setTables(result.data);
      } else {
        console.error("Failed to fetch tables:", result.message);
      }
    } catch (error) {
      console.error("Fetch error (tables):", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch categories, subcategories, and items for the restaurant.
   * This data is shown in the accordions for selection and customization.
   */
  const getInf = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseURLLocalPublic}/admin_api/show_category_subs_items?restaurant_id=${adminInfo?.restaurant_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status === true) {
        setData(result.data);
      } else {
        console.error('Error fetching categories and items');
      }
    } catch (error) {
      console.error('Fetch error (categories/items):', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category and table data on component mount
  useEffect(() => {
    getInf();
    getTables();
  }, []);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center w-full">
        <span className="loader">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {/* Render categories and their contents */}
      {data?.length > 0 ? (
        data.map((category) => (
          <Accordion className="bg-white" key={category?.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="flex gap-5 justify-center items-center">
                <img
                  src={category?.image}
                  className="w-[75px] h-[75px] rounded-4xl"
                  alt=""
                />
                <p>{category?.name}</p>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              {/* Category without any content */}
              {category.content === 0 ? (
                <div className="flex w-full justify-center items-center">
                  <p>No Items In this Category</p>
                </div>
              ) : category.content === 1 ? (
                // Category with subcategories
                category?.sub_category?.map((sub) => (
                  <Accordion className="bg-white" key={sub?.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <div className="flex gap-5 justify-center items-center">
                        <img
                          src={sub?.image}
                          className="w-[75px] h-[75px] rounded-4xl"
                          alt=""
                        />
                        <p>{sub?.name}</p>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      {sub?.items?.map((item) => (
                        <ItemAccordion
                          key={item?.id}
                          item={item}
                          setCart={setCart}
                          cart={cart}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                // Category with direct items
                category?.items?.map((item) => (
                  <ItemAccordion
                    key={item?.id}
                    item={item}
                    setCart={setCart}
                    cart={cart}
                  />
                ))
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-2xl">No Data Found</p>
        </div>
      )}

      {/* Modal for reviewing the cart and submitting the order */}
      <Cart
        setCart={setCart}
        cart={cart}
        show={showCart}
        onHide={() => setShowCart(false)}
        tables={tables}
        adminInfo={adminInfo}
      />

      {/* Notification container */}
      <ToastContainer />

      {/* Floating button to open cart modal */}
      <div className="fixed bottom-4 left-5 z-50">
        <button
          className="bg-[#1f2a40] text-white p-3 rounded-full shadow-md hover:bg-[#162030]"
          onClick={() => setShowCart(true)}
        >
          <FaCartShopping />
        </button>
      </div>
    </>
  );
};

export default AddOrder;
