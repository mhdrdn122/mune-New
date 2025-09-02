import { useEffect, useState } from "react";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import { ToastContainer } from "react-toastify";
import { FaCartShopping } from "react-icons/fa6";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Cart from "../../../components/Modals/CartModal/Cart";
import ItemAccordion from "../../../components/Admin/addOrder/ItemAccordion";
import SubAppBar from "../../../utils/SubAppBar";
import { useParams } from "react-router-dom";
import DynamicSkeleton from "../../../utils/DynamicSkeletonProps";
import useGetStyle from "../../../hooks/useGetStyle";

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
  const { id } = useParams() || 0;
  const { Color } = useGetStyle();

  /**
   * Fetch the list of restaurant tables.
   * Tables are required to assign orders to a specific table.
   */
  const getTables = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseURLLocalPublic}/admin_api/show_tables`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status === true) {
        setData(result.data);
      } else {
        console.error("Error fetching categories and items");
      }
    } catch (error) {
      console.error("Fetch error (categories/items):", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category and table data on component mount
  useEffect(() => {
    setCart([]);
    getInf();
    getTables();
  }, []);

  useEffect(() => {
    setCart([]);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-content-center gap-1 my-5 w-full flex-col">
        <DynamicSkeleton
          count={3}
          variant="rounded"
          height={150}
          animation="wave"
          spacing={3}
          columns={{ xs: 12, sm: 12, md: 12 }}
        />
      </div>
    );
  }

  return (
    <>
      <SubAppBar title=" اضافة طلب " />
      {/* Render categories and their contents */}
      {data?.length > 0 ? (
        data.map((category) => (
          <Accordion
            className="  my-2 text-white"
            key={category?.id}
            sx={{
              background: Color ? "#" + Color : "#2F4B26",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="#fff" />}
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
                  <Accordion
                    className="!bg-[#BDD358] my-2 text-[#2F4B26]"
                    key={sub?.id}
                  >
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
        tableNumber={id || null}
      />

      {/* Notification container */}
      <ToastContainer />

      <div className="fixed bottom-6 left-6 z-50">
        <button
          className={`
      relative
      w-16 h-16
      bg-gradient-to-br from-green-700 to-green-900
      text-white
      rounded-full
      shadow-2xl
      hover:shadow-lg
      transform
      transition-all
      duration-300
      hover:scale-110
      hover:rotate-3
      flex
      items-center
      justify-center
      group
      ${cart?.length > 0
              ? "ring-2 ring-red-400 ring-opacity-80 animate-bounce"
              : "ring-2 ring-white ring-opacity-60 animate-pulse"
            }
    `}
          disabled={cart?.length > 0 ? false : true}
          onClick={() => setShowCart(true)}
        >
          <FaCartShopping className="text-xl transform group-hover:scale-125 transition-transform duration-300" />

          <span
            className={`
      absolute
      -top-2
      -right-2
      w-6
      h-6
      flex
      items-center
      justify-center
      rounded-full
      text-xs
      font-bold
      ${cart?.length > 0 ? "bg-red-500 text-white" : "bg-white text-green-800"}
      transform
      transition-all
      duration-300
      group-hover:scale-125
      group-hover:-translate-y-1
    `}
          >
            {cart?.length || 0}
          </span>

          <span
            className={`
      absolute
      inset-0
      rounded-full
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-500
      ${cart?.length > 0 ? "bg-red-500 animate-ping" : "bg-white"}
    `}
          ></span>
        </button>
      </div>
    </>
  );
};

export default AddOrder;
