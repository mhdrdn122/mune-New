import { AccordionDetails, Accordion, AccordionSummary } from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaCheck } from "react-icons/fa6";
import notify from "../../../utils/useNotification";

/**
 * Check if two arrays contain the same elements (order does not matter).
 * @param {Array} a - First array.
 * @param {Array} b - Second array.
 * @returns {boolean} True if arrays are equal.
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val) => b.includes(val)) && b.every((val) => a.includes(val));
}

/**
 * ItemAccordion Component
 * A collapsible UI component for customizing a menu item (size, toppings, and removing components)
 * and adding it to a shopping cart.
 *
 * @param {Object} props
 * @param {Object} props.item - Menu item object with sizes, toppings, components, etc.
 * @param {Function} props.setCart - Function to update the cart state.
 * @param {Array} props.cart - Current cart contents.
 */

const ItemAccordion = ({ item, setCart, cart }) => {
  const [selectedSize, setSelectedSize] = useState(item?.sizes[0]); // Selected item size
  const [total, setTotal] = useState(item?.price); // Total price including extras
  const [selectedExtras, setSelectedExtras] = useState([]); // Array of selected topping IDs
  const [removed, setRemoved] = useState([]); // Array of removed component objects

  /**
   * Adds the current selection to the cart.
   * - If an identical item exists, increment its count.
   * - Else, add a new item to the cart.
   */
  const handleSubmit = () => {
    const removedComponents = removed.map((comp) => comp?.id);

    // Prevent adding item with null/zero price
    if (item.price == null || item.price === 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem?.sizes === selectedSize?.id &&
          arraysEqual(cartItem?.components, removedComponents) &&
          arraysEqual(cartItem?.toppings, selectedExtras)
      );

      if (existingItem) {
        // Increase count of the existing item
        return prevCart.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem?.sizes === selectedSize?.id &&
          arraysEqual(cartItem?.components, removedComponents) &&
          arraysEqual(cartItem?.toppings, selectedExtras)
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: item.id,
            name: item.name,
            count: 1,
            image: item.image || null,
            price: total,
            sizes: selectedSize?.id,
            toppings: selectedExtras,
            components: removedComponents,
          },
        ];
      }
    });

    notify("تمت الاضافة إلى السلة", "success");
  };

  /**
   * Toggles a component (ingredient) between being removed or included.
   * @param {Object} comp - The component object to remove or restore.
   */
  const handleRemove = (comp) => {
    setRemoved((prevRemoved) => {
      const exists = prevRemoved.find((item) => item.id === comp.id);
      return exists
        ? prevRemoved.filter((item) => item.id !== comp.id)
        : [...prevRemoved, comp];
    });
  };

  return (
    <Accordion className="!bg-[#D9D9D9]">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="flex gap-5 justify-center items-center">
          <img
            src={
              selectedSize?.image?.length > 0
                ? selectedSize?.image
                : item?.image
            }
            className="w-[75px] h-[75px] rounded-4xl"
            alt=""
          />
          <p>{item?.name}</p>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="flex flex-col justify-center items-center w-full">
          {/* Size selection */}
          {item?.sizes?.length > 0 && (
            <div className="flex rounded-3xl bg-gray-400 justify-center items-center p-1">
              {item?.sizes?.map((size) => (
                <span
                  key={size.name_ar}
                  className={`hover:cursor-pointer py-2 px-4 ${
                    selectedSize?.name_ar === size.name_ar &&
                    "bg-gray-100 rounded-3xl"
                  }`}
                  onClick={() => {
                    setTotal(total - selectedSize?.price + size.price);
                    setSelectedSize(size);
                  }}
                >
                  {size.name_ar}
                </span>
              ))}
            </div>
          )}

          {/* Toppings section */}
          {item?.toppings?.length > 0 && (
            <div
              className="w-full flex flex-col gap-2 justify-center"
              dir="rtl"
            >
              <div className="text-white text-2xl w-full">
                <p>أضف الى الطبق</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.toppings.map((extra, index) => {
                  const isSelected = selectedExtras.includes(extra?.id);
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedExtras(
                            selectedExtras.filter((id) => id !== extra?.id)
                          );
                          setTotal(total - extra.price);
                        } else {
                          setSelectedExtras([...selectedExtras, extra?.id]);
                          setTotal(total + extra.price);
                        }
                      }}
                      className={`relative flex flex-col p-3 w-[75px] h-[110px] bg-white rounded-lg justify-center items-center hover:cursor-pointer border-2 ${
                        isSelected ? "border-green-500" : "border-gray-400"
                      }`}
                    >
                      <img src={extra.icon} alt="" />
                      <p className="text-sm">{extra.name_ar}</p>
                      <p>{extra.price}</p>
                      {isSelected && (
                        <FaCheck className="absolute top-1 right-1 text-green-600 bg-white rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Removable components section */}
          {item?.components?.length > 0 && (
            <div className="w-full flex flex-col gap-2 items-center" dir="rtl">
              <div className="w-full text-2xl text-white">إزالة عناصر</div>
              <div className="flex flex-wrap gap-2 justify-start items-center w-full">
                {item.components.map((comp, i) => (
                  <div
                    key={comp + i}
                    className="flex gap-3 p-2 bg-gray-500 rounded-2xl"
                  >
                    <p
                      className={`${
                        removed.find((rem) => rem.name === comp.name)
                          ? "text-gray-200 line-through"
                          : "text-white"
                      }`}
                    >
                      {comp.name_ar}
                    </p>
                    {comp.status === 1 && (
                      <span
                        className="text-white hover:cursor-pointer"
                        onClick={() => handleRemove(comp)}
                      >
                        X
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <span
            onClick={handleSubmit}
            className="w-[60%] text-center py-1 rounded-3xl self-center hover:cursor-pointer bg-[#2F4B26] border-2 border-gray-600 text-white mt-2"
          >
            +{total}
          </span>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default ItemAccordion;
