import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import notify from "../../../utils/useNotification";

/**
 * Compares two arrays to check if they have the same elements regardless of order.
 * @param {Array} a - First array.
 * @param {Array} b - Second array.
 * @returns {boolean} True if both arrays contain the same elements.
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every(val => b.includes(val)) && b.every(val => a.includes(val));
}

/**
 * Adds an item to the cart. If an identical item already exists (based on size, toppings, components),
 * it increases the quantity instead.
 *
 * @param {Object} item - The item object to add.
 * @param {Function} setCart - Function to update the cart state.
 */
export const handleAddToCart = (item, setCart) => {
  if (item.price == null || item.price === 0) return;

  setCart((prevCart) => {
    const existingItem = prevCart.find(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.sizes === item.sizes &&
        arraysEqual(cartItem.components, item.components) &&
        arraysEqual(cartItem.toppings, item.toppings)
    );

    if (existingItem) {
      // Increase quantity for existing item
      return prevCart.map((cartItem) =>
        cartItem.id === item.id &&
        cartItem.sizes === item.sizes &&
        arraysEqual(cartItem.components, item.components) &&
        arraysEqual(cartItem.toppings, item.toppings)
          ? { ...cartItem, count: cartItem.count + 1 }
          : cartItem
      );
    } else {
      // Add new item with initial count 1
      return [...prevCart, { ...item, count: 1 }];
    }
  });

  notify("تمت الاضافة إلى السلة", "success");
};

/**
 * Removes one unit of an item from the cart. If the quantity reaches 0, the item is removed entirely.
 *
 * @param {Object} item - The item object to remove.
 * @param {Function} setCart - Function to update the cart state.
 */
export const handleRemoveFromCart = (item, setCart) => {
  setCart((prevCart) =>
    prevCart
      .map((cartItem) =>
        cartItem.id === item.id &&
        cartItem.sizes === item.sizes &&
        arraysEqual(cartItem.components, item.components) &&
        arraysEqual(cartItem.toppings, item.toppings) &&
        cartItem.count > 0
          ? { ...cartItem, count: cartItem.count - 1 }
          : cartItem
      )
      .filter((cartItem) => cartItem.count > 0) // Remove items with 0 count
  );
};

/**
 * Submits the current cart as an order to the backend API.
 * Maps cart items to the required format and clears the cart upon successful submission.
 *
 * @param {Array} cart - Current items in the cart.
 * @param {Function} setCart - Function to clear the cart.
 * @param {Function} setLoadingAddOrder - Function to toggle loading state.
 * @param {Object} adminInfo - Admin info containing authorization token.
 * @param {number} tableId - Selected table ID for the order.
 * @param {Function} onHide - Function to close the modal.
 */
export const onSubmit = async (cart, setCart, setLoadingAddOrder, adminInfo, tableId, onHide) => {
  const orderData = {
    data: cart.map((item) => ({
      item_id: item.id,
      name: item.name,
      count: item.count,
      image: item.image || null,
      price: item.price,
      size_id: item.sizes,
      toppings: item.toppings.map((id) => ({ topping_id: id })),
      components: item.components.map((id) => ({ component_id: id })),
    })),
    table_id: tableId,
  };

  try {
    setLoadingAddOrder(true);

    const response = await fetch(`${baseURLLocalPublic}/admin_api/add_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.status) {
      console.log("Order submitted successfully!", result);
      setTimeout(() => {
        notify(result.message, "success");
      }, 500);
      setCart([]); // Reset cart after successful submission
      onHide();     // Close modal
    } else {
      console.error("Order submission failed:", result.message);
      notify(result.message, "error");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setLoadingAddOrder(false);
  }
};
